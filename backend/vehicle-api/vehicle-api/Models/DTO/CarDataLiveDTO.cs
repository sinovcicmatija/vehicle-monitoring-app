using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace vehicle_api.Models.DTO
{
    public class CarDataLiveDTO
    {
        [JsonPropertyName("rpm")]
        public int Rpm {  get; set; }

        [JsonPropertyName("speed")]
        public int Speed { get; set; }

        [JsonPropertyName("engineTemperature")]
        public int EngineTemperature { get; set; }

        [JsonPropertyName("intakeTemperature")]
        public int IntakeTemperature { get; set; }

        [JsonPropertyName("fuelLevel")]
        public int FuelLevel { get; set; }

    }
}
