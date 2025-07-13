using vehicle_api.Models;

namespace vehicle_api.Interface
{
    public interface ICarService
    {
        Task<Car> DecodeAndSaveCarAsync(string vin);
    }
}
