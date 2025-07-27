namespace vehicle_api.Models.DTO
{
    public class CarDataLiveDTO
    {
        public int Rpm {  get; set; }
        public int Speed { get; set; }
        public int EngineTemperature { get; set; }
        public int IntakeTemperature { get; set; }
        public int FuelLevel { get; set; }

    }
}
