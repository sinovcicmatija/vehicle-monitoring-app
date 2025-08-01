namespace vehicle_api.Models.DTO
{
    public class SaveCarServiceEventDTO
    {
        public string? Vin { get; set; }
        public DateOnly? PerformedDate { get; set; }
        public int? MileageAtService { get; set; }
        public string? Notes { get; set; }
        public List<string>? PerformedServices { get; set; }
    }
}
