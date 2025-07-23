using Microsoft.AspNetCore.SignalR;
using MQTTnet;
using MQTTnet.Server;
using System.Text;
using System.Text.Json;
using vehicle_api.Models.DTO;
using vehicle_api.Utils;

namespace vehicle_api.External.MQTTCommunication
{
    public class MQTTHandler
    {
        private readonly IMqttClient _mqttClient;
        private readonly IHubContext<CarDataHub> _hubContext;

        public MQTTHandler(IHubContext<CarDataHub> hubContext)
        {
            _hubContext = hubContext;
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
                else if(topic == "esp32/response/liveData")
                {
                    try
                    {
                        var liveData = JsonSerializer.Deserialize<CarDataLiveDTO>(payload);
                        if (liveData != null)
                        {
                            await _hubContext.Clients.All.SendAsync("ReciveLiveData", liveData);
                        }
                        else
                        {
                            Console.WriteLine("Deserializacija live podataka nije uspjela.");
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Greška pri deserializaciji live podataka: {ex.Message}");
                    }
                }
                await Task.CompletedTask;
            };
             
            await _mqttClient.ConnectAsync(mqttClientOptions);
            await _mqttClient.SubscribeAsync("esp32/response/vin");
            await _mqttClient.SubscribeAsync("esp32/response/liveData");

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
        public async Task RequestLiveDataAsync()
        {

            var message = new MqttApplicationMessageBuilder()
                .WithTopic("esp32/request/startLiveDataStream")
                .WithPayload("get_liveData")
                .Build();

            await _mqttClient.PublishAsync(message);
        }
        public async Task StopLiveDataAsync()
        {

            var message = new MqttApplicationMessageBuilder()
                .WithTopic("esp32/request/stopLiveDataStream")
                .WithPayload("stop_liveData")
                .Build();

            await _mqttClient.PublishAsync(message);
        }
    }
}
