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

        [HttpGet("decodevin")]
        public async Task<IActionResult> DecodeVin()
        {
            var car = await _carService.DecodeAndSaveCarAsync();

            return Ok(car);
        }

        [HttpGet("startLiveStream")]
        public async Task<IActionResult> StartLiveStream()
        {
            await _carService.StartStreamAsync();
            return Ok();
        }

        [HttpGet("stopLiveStream")]
        public async Task<IActionResult> StopLiveStream()
        {
            await _carService.StopStreamAsync();
            return Ok();
        }

        [HttpGet("dtc")]
        public async Task<IActionResult> GetDtc()
        {
            var dtc = await _carService.GetDtc();

            return Ok(dtc);
        }

        [HttpGet("getCarServiceHistory")]

        public async Task<IActionResult> GetCarServiceHistory([FromQuery] string vin)
        {
            var serviceHistory = await _carService.GetCarServiceHistory(vin);
            return Ok(serviceHistory);
        }

        [HttpPost("saveCarServiceEvent")]

        public async Task<IActionResult> SaveCarServiceEvent([FromBody] SaveCarServiceEventDTO carServiceEvent)
        {
            await _carService.SaveCarServiceEventAsync(carServiceEvent);
            return Ok();
        }
    }
}

