using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Domain.ValueObject;

public class HistoryPeripheral
{
    public string? Description { get; set; }
    public string Severity { get; set; } = SeverityLevel.Good.ToString();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
