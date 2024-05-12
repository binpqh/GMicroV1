using AsimKiosk.Contracts.Kiosk.Peripheral;
namespace AsimKiosk.Contracts.Kiosk;

public class KioskUpdateRequest
{
    public string POSCodeTerminal { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string GroupId { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string StoreCode { get; set; } = string.Empty;
}
