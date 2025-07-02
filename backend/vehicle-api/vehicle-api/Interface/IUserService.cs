using Microsoft.EntityFrameworkCore;
using vehicle_api.Models;
using vehicle_api.Models.DTO;
using vehicle_api.Utils;

namespace vehicle_api.Interface
{
    public interface IUserService
    {
        Task<AuthResult> RegisterUserAsync(RegisterUserDTO registerUser);

        Task<AuthResult> LoginUserAsync(string username, string password);
    }
}

