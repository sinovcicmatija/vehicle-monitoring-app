namespace vehicle_api.External.MQTTCommunication
{
    public class MQTTStartupService : IHostedService
    {
        private readonly MQTTHandler _mqttHandler;

        public MQTTStartupService(MQTTHandler mqttHandler)
        {
            _mqttHandler = mqttHandler;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            await Task.Delay(2000);
            const int maxAttempts = 10;
            int attempt = 0;
            while (attempt < maxAttempts)
            {
                try
                {
                    await _mqttHandler.InitilizeAsync();
                    Console.WriteLine("MQTT klijent uspješno spojen.");
                    return;
                }
                catch (Exception ex)
                {
                    attempt++;
                    Console.WriteLine($"MQTT klijent nije mogao spojiti (pokušaj {attempt}): {ex.Message}");
                    await Task.Delay(500);
                }
            }
            Console.WriteLine("MQTT klijent nije se uspio spojiti ni nakon više pokušaja.");
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            // Optionally disconnect the client here
            return Task.CompletedTask;
        }
}
}
