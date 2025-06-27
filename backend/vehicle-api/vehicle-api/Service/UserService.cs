using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using vehicle_api.Data;
using vehicle_api.Interface;
using vehicle_api.Models;
using vehicle_api.Models.DTO;

namespace vehicle_api.Service
{
    public class UserService : IUserService
    {

        private readonly VehicleDbContext _context;
        public UserService(VehicleDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CreateUserAsync(RegisterUserDTO registerUser)
        {
            var user = new User
            {
                FirstName = registerUser.FirstName,
                LastName = registerUser.LastName,
                Email = registerUser.Email,
                Username = registerUser.Username,
                CreatedAt = DateTime.UtcNow,

            };

            var hasher = new PasswordHasher<User>();
            string hash = hasher.HashPassword(user, registerUser.Password);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }
    }
}
