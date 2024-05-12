namespace AsimKiosk.Contracts.Kiosk.Peripheral;

public class PeripheralLogResponse
{
    public string Description { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}
