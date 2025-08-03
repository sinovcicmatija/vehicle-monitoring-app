using Microsoft.AspNetCore.Mvc;
using vehicle_api.Models;
using vehicle_api.Models.DTO;

namespace vehicle_api.Interface
{
    public interface ICarService
    {
        Task<Car> DecodeAndSaveCarAsync();
        Task StartStreamAsync();
        Task StopStreamAsync();
        Task<List<string>> GetDtc();
        Task<List<ServiceHistoryDTO>> GetCarServiceHistory(string vin);
        Task SaveCarServiceEventAsync(SaveCarServiceEventDTO carServiceEvent);
        Task ConnectUserAndVehicle(string username, string vin);
        Task<List<FollowedCarsDTO>> GetFollowedCars(string username);
        Task RemoveConnectionBetweenUserAndVehicle(string username, string vin);
        Task<List<string>> GetServiceTypes();
    }
}
