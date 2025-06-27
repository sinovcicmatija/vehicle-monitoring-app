using System;
using System.Collections.Generic;

namespace vehicle_api.Models;

public partial class ServiceHistory
{
    public int Id { get; set; }

    public int CarId { get; set; }

    public int ServiceTypeId { get; set; }

    public DateOnly? PerformedDate { get; set; }

    public int? MileageAtService { get; set; }

    public virtual Car Car { get; set; } = null!;

    public virtual ServiceType ServiceType { get; set; } = null!;
}
