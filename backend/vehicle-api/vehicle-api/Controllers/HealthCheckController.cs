using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using vehicle_api.Data;

namespace vehicle_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthCheckController : ControllerBase
    {

        [HttpGet("/healthcheck")]
        public IActionResult HealthCheck([FromServices] VehicleDbContext db)
        {
            bool canConnect = db.Database.CanConnect();

            return Ok(new
            {
                Status = canConnect ? "OK": "FAIL",
                Message = canConnect
                ? "Sve radi normalno."
                : "Baza nije dostupna. Molimo pokušajte kasnije."
            });

        }
    }
}
