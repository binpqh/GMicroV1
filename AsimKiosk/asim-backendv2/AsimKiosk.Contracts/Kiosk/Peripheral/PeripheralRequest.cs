using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Contracts.Kiosk.Peripheral;

public class PeripheralRequest
{
    public string ProductCode { get; set; } = string.Empty;
    public string ItemCode { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public bool HasSerialNumbers { get; set; }

}
