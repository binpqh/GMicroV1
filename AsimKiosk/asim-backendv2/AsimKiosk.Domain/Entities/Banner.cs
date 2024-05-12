using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace AsimKiosk.Domain.Entities;

[Table("Banner")]
public class Banner : Entity
{ 
    public string ImageKey { get; set; } = string.Empty;
    public string Status { get; set; } = ActiveStatus.Inactive.ToString();
    public int Priority { get; set; }
}