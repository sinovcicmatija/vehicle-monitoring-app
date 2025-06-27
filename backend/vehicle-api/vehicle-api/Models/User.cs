using System;
using System.Collections.Generic;

namespace vehicle_api.Models;

public partial class User
{
    public int Id { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Username { get; set; }

    public string? Email { get; set; }

    public string? PasswordHash { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<OwnershipHistory> OwnershipHistories { get; set; } = new List<OwnershipHistory>();
}
