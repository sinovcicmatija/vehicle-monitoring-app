using vehicle_api.Models;
using vehicle_api.Models.DTO;

namespace vehicle_api.Utils
{
    public class AuthResult
    {
        public bool Success { get; set; }
        public string? Message { get; set; }

        public LoggedInUserDTO? User { get; set; }
    }
}
