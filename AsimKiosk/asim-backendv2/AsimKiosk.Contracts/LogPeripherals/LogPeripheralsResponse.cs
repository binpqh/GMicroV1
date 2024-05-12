namespace AsimKiosk.Contracts.LogPeripherals;

public class LogPeripheralsResponse
{     
    public string Id { get; set; } = string.Empty;
    public string DeviceId { get; set; } = string.Empty;
    public string DeviceName { get; set; } = string.Empty;
    public string IdPeripherals { get; set; } = string.Empty;
    public string typeLog { get; set; } = string.Empty;
    public object? Data { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ModifiedOn { get; set; }
}
