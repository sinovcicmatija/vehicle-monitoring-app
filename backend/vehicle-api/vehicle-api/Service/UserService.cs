using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using vehicle_api.Data;
using vehicle_api.Interface;
using vehicle_api.Models;
using vehicle_api.Utils;
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

        public async Task<AuthResult> RegisterUserAsync(RegisterUserDTO registerUser)
        {
            if (await _context.Users.AnyAsync(u =>
            u.Username == registerUser.Username || u.Email == registerUser.Email))
            {
                return new AuthResult
                {
                    Success = false,
                    Message = "Korisnik sa ovim korisničkim imenom ili emailom već postoji."
                };
            }

            var user = new User
            {
                FirstName = registerUser.FirstName,
                LastName = registerUser.LastName,
                Email = registerUser.Email,
                Username = registerUser.Username,
                CreatedAt = DateTime.UtcNow,
            };

            var hasher = new PasswordHasher<User>();
            user.PasswordHash = hasher.HashPassword(user, registerUser.Password);

            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return new AuthResult
                {
                    Success = true,
                    Message = "Korisnik uspješno registriran."
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] RegisterUserAsync: {ex.Message}");

                return new AuthResult
                {
                    Success = false,
                    Message = "Dogodila se greška pri registraciji. Molim pokušajte ponovno."
                };
            }            
        }

        public async Task<AuthResult> LoginUserAsync(string username, string password)
        {
           var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
                return new AuthResult
                {
                    Success = false,
                    Message = "Korisnik s ovim korisničkim imenom ne postoji."
                };

            var hasher = new PasswordHasher<User>();
            var result = hasher.VerifyHashedPassword(user, user.PasswordHash!, password);

            return result == PasswordVerificationResult.Success
                ? new AuthResult { Success = true, Message = "Uspješna prijava." }
                : new AuthResult { Success = false, Message = "Lozinka nije ispravna." };
        }
    }
}
