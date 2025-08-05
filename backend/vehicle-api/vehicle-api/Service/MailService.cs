using Microsoft.EntityFrameworkCore;
using vehicle_api.Data;
using vehicle_api.Utils;

namespace vehicle_api.Service
{
    public class MailService
    {
        private readonly VehicleDbContext _dbContext;
        private readonly MailSetup _mailSetup;

        public MailService(VehicleDbContext vehicleDbContext, MailSetup mailSetup) 
        {
            _dbContext = vehicleDbContext;
            _mailSetup = mailSetup;
        
        }
        public async Task CheckServiceHistoryInterval()
        {
            var now = DateOnly.FromDateTime(DateTime.UtcNow);

            var activeOwnerships = await _dbContext.OwnershipHistories
                .Where(oh => oh.EndDate == null)
                .Select(oh => new { oh.CarId, oh.UserId })
                .ToListAsync();

            var groupedByCar = activeOwnerships
                .GroupBy(oh => oh.CarId)
                .ToDictionary(g => g.Key, g => g.Select(o => o.UserId).ToList());

            var carsToNotify = new List<(int userId, int carId, string reason)>(); 

            foreach (var (carId, userIds) in groupedByCar)
            {
                var car = await _dbContext.Cars.FindAsync(carId);
                var carInfo = $"{car.Brand} {car.Model} ({car.MakeYear}) - {car.Vin}";

                var serviceEvents = await _dbContext.ServiceEvents
                    .Where(se => se.CarId == carId)
                    .Include(se => se.ServiceEventTypes)
                        .ThenInclude(set => set.ServiceType)
                    .ToListAsync();

                foreach (var ev in serviceEvents)
                {
                    foreach (var set in ev.ServiceEventTypes)
                    {
                        var interval = set.ServiceType.TimeIntervalDays;
                        if (interval == null) continue;

                        if (ev.PerformedDate == null)
                            continue;

                        var totalDays = now.DayNumber - ev.PerformedDate.Value.DayNumber;
                        var overdueDays = totalDays - interval.Value;

                        if (overdueDays > 0)
                        {
                            foreach (var userId in userIds.Distinct())
                            {
                                carsToNotify.Add((userId, carId, $"Vozilo: {carInfo}\nPrekoračeno {overdueDays:F0} dana za servis: {set.ServiceType.ServiceName}"));
                            }
                        }
                    }
                }
            }

            foreach (var (userId, carId, reason) in carsToNotify)
            {
                var user = await _dbContext.Users.FindAsync(userId);
                if (user == null || string.IsNullOrWhiteSpace(user.Email)) continue;

                Console.WriteLine($"Sending email to {user.Email} about CarId {carId}: {reason}");
                await _mailSetup.SendEmailAsync(user.Email, "Vrijeme za servis", reason);
            }
        }

    }
}
