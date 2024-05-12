using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Domain.Entities;

public class Video : Entity
{
    public string DeviceId { get; set; } = string.Empty;
    public string VideoKey { get; set; } = string.Empty;
    public int VideoSecondDuration { get; set; }
    public long VideoSize { get; set; }
    public DateTime CreateAt { get; set; } = DateTime.UtcNow;
}
