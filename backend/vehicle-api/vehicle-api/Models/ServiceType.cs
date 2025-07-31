using System;
using System.Collections.Generic;

namespace vehicle_api.Models;

public partial class ServiceType
{
    public int Id { get; set; }

    public string ServiceName { get; set; } = null!;

    public int? MileageInterval { get; set; }

    public int? TimeIntervalDays { get; set; }

    public virtual ICollection<ServiceEventType> ServiceEventTypes { get; set; } = new List<ServiceEventType>();
}
