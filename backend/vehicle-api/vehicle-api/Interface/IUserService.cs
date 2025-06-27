using Microsoft.EntityFrameworkCore;
using vehicle_api.Models;
using vehicle_api.Models.DTO;

namespace vehicle_api.Interface
{
    public interface IUserService
    {
        Task<bool> CreateUserAsync(RegisterUserDTO registerUser);

        Task<User?> GetUserByUsernameAsync(string username);
    }
}

