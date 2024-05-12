using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Domain.Entities;

public class Log : Entity
{
    public string Type { get; set; } = ClientType.Kiosk.ToString();
    public string DeviceId { get; set; } = null!;
    public string UrlAPI { get; set; } = null!;
    public string JsonData { get; set; } = null!;
    public string Desc { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
