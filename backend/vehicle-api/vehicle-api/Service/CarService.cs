using Microsoft.EntityFrameworkCore;
using vehicle_api.Data;
using vehicle_api.External.MQTTCommunication;
using vehicle_api.External.VinDecoder;
using vehicle_api.Interface;
using vehicle_api.Models;

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
    }
}
