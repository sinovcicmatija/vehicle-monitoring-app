using MQTTnet;
using MQTTnet.Server;
using System.Text;

namespace vehicle_api.External.MQTTCommunication
{
    public class MQTTHandler
    {
        private readonly IMqttClient _mqttClient;

        public MQTTHandler()
        {
            var mqttfactory = new MqttClientFactory();
            _mqttClient = mqttfactory.CreateMqttClient();
        }
      
        public async Task InitilizeAsync()
        {
                var mqttClientOptions = new MqttClientOptionsBuilder()
               .WithTcpServer("127.0.0.1", 1883)
               .WithClientId("backendClient")
               //.WithCleanSession()
               .Build();

            _mqttClient.ApplicationMessageReceivedAsync += async e =>
            {
                var topic = e.ApplicationMessage.Topic;
                var payload = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);

                Console.WriteLine($"Primljena poruka na topicu '{topic}': {payload}");

                if (topic == "esp32/response/vin")
                {
                    if(_vinResponseTcs  != null)
                    _vinResponseTcs.TrySetResult(payload);
                }
                await Task.CompletedTask;
            };

            await _mqttClient.ConnectAsync(mqttClientOptions);
            await _mqttClient.SubscribeAsync("esp32/response/vin");
        }

        private TaskCompletionSource<string>? _vinResponseTcs;
        public async Task<string> RequestVinAsync()
        {
            _vinResponseTcs = new TaskCompletionSource<string>();

            var message = new MqttApplicationMessageBuilder()
                .WithTopic("esp32/request/vin")
                .WithPayload("get_vin")
                .Build();

            await _mqttClient.PublishAsync(message);
            return await _vinResponseTcs.Task;  
        }
    }
}
