namespace vehicle_api.Models
{
    public class ServiceEventType
    {
        public int Id { get; set; }
        public int ServiceEventId { get; set; }
        public int ServiceTypeId { get; set; }
        public virtual ServiceEvent ServiceEvent { get; set; } = null!;
        public virtual ServiceType ServiceType { get; set; } = null!;
    }
}
