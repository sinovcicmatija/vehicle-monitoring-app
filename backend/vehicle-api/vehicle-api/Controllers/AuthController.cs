using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using vehicle_api.Interface;
using vehicle_api.Models.DTO;
using vehicle_api.Service;

namespace vehicle_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
 
        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("registeruser")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterUserDTO user)
        {
            var result = await _userService.RegisterUserAsync(user);

            if (result.Success)
                return Ok(result);

            return BadRequest(result);
        }

        [HttpPost("loginuser")]
        public async Task<IActionResult> LoginUser([FromBody] LoginUserDTO user)
        {
            var result = await _userService.LoginUserAsync(user.Username, user.Password);

            if (result.Success)
                return Ok(result);

            return BadRequest(result);
        }
    }
}
