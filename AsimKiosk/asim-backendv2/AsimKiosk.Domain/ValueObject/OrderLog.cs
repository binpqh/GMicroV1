namespace AsimKiosk.Domain.ValueObject;
public class OrderLog
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public required string Message { get; set; }
    public required string ExtDeviceCode { get; set; }
}

public record OrderLogRequest(string orderCode, string message, string extDeviceCode);