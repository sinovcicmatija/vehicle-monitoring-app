using System;
using System.Collections.Generic;

namespace vehicle_api.Models;

public partial class ServiceEvent
{
    public int Id { get; set; }

    public int CarId { get; set; }

    public DateOnly? PerformedDate { get; set; }

    public int? MileageAtService { get; set; }

    public string? Notes { get; set; }

    public virtual Car Car { get; set; } = null!;
    public virtual ICollection<ServiceEventType> ServiceEventTypes { get; set; } = new List<ServiceEventType>();
}
