using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using vehicle_api.Interface;
using vehicle_api.Models.DTO;

namespace vehicle_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        private readonly ICarService _carService;

        public VehicleController(ICarService carService)
        {
            _carService = carService;
        }

        [HttpPost("decodevin")]
        public async Task<IActionResult> DecodeVin()
        {
            var car = await _carService.DecodeAndSaveCarAsync();

            return Ok(car);
        }     
    }
}
