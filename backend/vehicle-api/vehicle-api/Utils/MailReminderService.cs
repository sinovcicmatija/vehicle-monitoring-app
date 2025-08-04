using vehicle_api.Service;

namespace vehicle_api.Utils
{
    public class MailReminderService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public MailReminderService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using var scope = _scopeFactory.CreateScope();
            var mailService = scope.ServiceProvider.GetRequiredService<MailService>();
            await mailService.CheckServiceHistoryInterval();
        }

    }
}
