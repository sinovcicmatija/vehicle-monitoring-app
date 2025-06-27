using System;
using System.Collections.Generic;

namespace vehicle_api.Models;

public partial class Car
{
    public int Id { get; set; }

    public string? Vin { get; set; }

    public string? Brand { get; set; }

    public string? Model { get; set; }

    public short? MakeYear { get; set; }

    public string? EngineType { get; set; }

    public virtual ICollection<OwnershipHistory> OwnershipHistories { get; set; } = new List<OwnershipHistory>();

    public virtual ICollection<ServiceHistory> ServiceHistories { get; set; } = new List<ServiceHistory>();
}
