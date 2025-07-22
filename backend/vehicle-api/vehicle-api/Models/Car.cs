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

    public string? Body { get; set; }

    public short? LengthMm { get; set; }

    public short? WidthMm { get; set; }

    public short? HeightMm { get; set; }

    public short? WeightEmptyKg { get; set; }

    public short? MaxWeightKg { get; set; }

    public short? MaxRoofLoadKg { get; set; }

    public string? FrontBrakes { get; set; }

    public string? RearBrakes { get; set; }

    public string? WheelSize { get; set; }

    public string? EmissionStandard { get; set; }

    public short? MaxSpeedKmh { get; set; }

    public bool? ABSState { get; set; }

    public virtual ICollection<OwnershipHistory> OwnershipHistories { get; set; } = new List<OwnershipHistory>();

    public virtual ICollection<ServiceHistory> ServiceHistories { get; set; } = new List<ServiceHistory>();
}
