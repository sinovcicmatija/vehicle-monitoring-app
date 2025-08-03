using vehicle_api.Data;

namespace vehicle_api.Service
{
    public class MailService
    {
        private readonly VehicleDbContext _dbContext;

        public MailService(VehicleDbContext vehicleDbContext) 
        {
            _dbContext = vehicleDbContext;
        
        }
        public async Task CheckServiceHistoryInterval()
        {
            //var activeOwnersCarId = await _dbContext.OwnershipHistories
            //    .Where(oh => oh.EndDate == null)
            //    .Select(oh => oh.CarId)
            //    .ToList();


        }
    }
}
