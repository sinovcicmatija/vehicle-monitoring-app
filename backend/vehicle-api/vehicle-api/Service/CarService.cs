using System.Runtime.InteropServices;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vehicle_api.Data;
using vehicle_api.External.MQTTCommunication;
using vehicle_api.External.VinDecoder;
using vehicle_api.Interface;
using vehicle_api.Models;
using vehicle_api.Models.DTO;

namespace vehicle_api.Service
{
    public class CarService: ICarService
    {
        private readonly MQTTHandler _mqttHandler;
        private readonly VinDecoderApiService _vinDecoder;
        private readonly VehicleDbContext _dbContext;

        public CarService(MQTTHandler mqttHandler,VinDecoderApiService vinDecoder, VehicleDbContext dbContext)
        {
            _vinDecoder = vinDecoder;
            _dbContext = dbContext;
            _mqttHandler = mqttHandler;
        }

        public async Task<Car> DecodeAndSaveCarAsync()
        {
            var vin = await _mqttHandler.RequestVinAsync();
            var existingCar = await _dbContext.Cars.FirstOrDefaultAsync(c => c.Vin == vin);
            if (existingCar != null)
            {
                return existingCar;
            }

            var car = await _vinDecoder.DecodeVinAsync(vin);

            _dbContext.Cars.Add(car);
            await _dbContext.SaveChangesAsync();

            return car;
        }

        public async Task StartStreamAsync()
        {
            await _mqttHandler.RequestLiveDataAsync();
        }

        public async Task StopStreamAsync()
        {
            await _mqttHandler.StopLiveDataAsync();
        }

        public async Task<List<string>> GetDtc()
        {
            List<string> dtc = await _mqttHandler.RequestDtcAsync();
            return dtc;
        }

        public async Task<List<ServiceHistoryDTO>> GetCarServiceHistory(string vin)
        {
            int? id = await _dbContext.Cars
                .Where(c => c.Vin == vin)
                .Select(c => (int?)c.Id)
                .FirstOrDefaultAsync();
            if(id == null)
            { 
                throw new Exception("Vozilo s tim VIN-om nije pronađeno.");
            }

            var serviceEvents = await _dbContext.ServiceEvents.Where(c => c.CarId == id).ToListAsync();
            if(serviceEvents.Count == 0)
            {
                return new List<ServiceHistoryDTO>();
            }

            var result = new List<ServiceHistoryDTO>();

            foreach (var se in serviceEvents)
            {
                var serviceNames = await _dbContext.ServiceEventTypes
                    .Where(set => set.ServiceEventId == se.Id)
                    .Select(set => set.ServiceType.ServiceName)
                    .ToListAsync();

                result.Add(new ServiceHistoryDTO
                {
                    PerformedDate = se.PerformedDate,
                    MileageAtService = se.MileageAtService,
                    Notes = se.Notes,
                    PerformedServices = serviceNames
                });
            }
            return result;       
        }

        public async Task SaveCarServiceEventAsync(SaveCarServiceEventDTO carServiceEvent)
        {
            if(carServiceEvent == null)
            {
                throw new Exception("Greška u sustavu");
            }

            int? id = await _dbContext.Cars
                .Where(c => c.Vin == carServiceEvent.Vin)
                .Select(c => (int?)c.Id)
                .FirstOrDefaultAsync();

            if (id == null)
            {
                throw new Exception("Vozilo s tim VIN-om nije pronađeno.");
            }

            var newServiceEvent = new ServiceEvent
            {
                CarId = id.Value,
                PerformedDate = carServiceEvent.PerformedDate,
                MileageAtService = carServiceEvent.MileageAtService,
                Notes = carServiceEvent.Notes,
            };

            _dbContext.ServiceEvents.Add(newServiceEvent);
            await _dbContext.SaveChangesAsync();

            if (carServiceEvent.PerformedServices == null || carServiceEvent.PerformedServices.Count == 0)
            {
                throw new Exception("Greška u sustavu, nije se odradio ni jedan servis!");
            }

            foreach (var serviceName in carServiceEvent.PerformedServices)
            {
                var serviceTypeId = await _dbContext.ServiceTypes
                    .Where(st => st.ServiceName == serviceName)
                    .Select(st => st.Id)
                    .FirstOrDefaultAsync();

                var newServiceEventType = new ServiceEventType
                {
                    ServiceEventId = newServiceEvent.Id,
                    ServiceTypeId = serviceTypeId
                };
                _dbContext.ServiceEventTypes.Add(newServiceEventType);
            }
            await _dbContext.SaveChangesAsync();

        }

        public async Task ConnectUserAndVehicle(string username, string vin)
        {
            int carId = await _dbContext.Cars
                .Where(c => c.Vin == vin)
                .Select(c => c.Id)
                .FirstOrDefaultAsync();

            int userId = await _dbContext.Users
                .Where(u => u.Username == username)
                .Select(u => u.Id)
                .FirstOrDefaultAsync();

            var newOwnershipHistoryInput = new OwnershipHistory
            {
                UserId = userId,
                CarId = carId,
                StartDate = DateOnly.FromDateTime(DateTime.Today)
            };

            _dbContext.OwnershipHistories.Add(newOwnershipHistoryInput);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<FollowedCarsDTO>> GetFollowedCars(string username)
        {
            int userId = await _dbContext.Users
                .Where(u => u.Username == username)
                .Select(u => u.Id)
                .FirstOrDefaultAsync();

            var cars = await _dbContext.OwnershipHistories
                .Where(o => o.UserId == userId && o.EndDate == null)
                .Include(o => o.Car)
                .Select(o => o.Car)
                .ToListAsync();

            if (cars.Count == 0)
                return new List<FollowedCarsDTO>();

            var followedCars = new List<FollowedCarsDTO>();

            foreach (var car in cars)
            {
                followedCars.Add(new FollowedCarsDTO
                {
                    Vin = car.Vin,
                    Brand = car.Brand,
                    Model = car.Model,
                    MakeYear = car.MakeYear
                });
            }

            return followedCars;      
        }

        public async Task RemoveConnectionBetweenUserAndVehicle(string username, string vin)
        {
            int userId = await _dbContext.Users
                .Where(u => u.Username == username)
                .Select(u => u.Id)
                .FirstOrDefaultAsync();

            int carId = await _dbContext.Cars
                .Where(c => c.Vin == vin)
                .Select(c => c.Id)
                .FirstOrDefaultAsync();

            var ownerships = await _dbContext.OwnershipHistories
                .Where(o => o.UserId == userId && o.CarId == carId && o.EndDate == null)
                .ToListAsync();

            foreach (var ownership in ownerships)
            {
                ownership.EndDate = DateOnly.FromDateTime(DateTime.Today);
            }

            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<string>> GetServiceTypes()
        {
            return await _dbContext.ServiceTypes
                .Select(st => st.ServiceName) 
                .ToListAsync();
        }

    }
}
