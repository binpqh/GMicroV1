namespace AsimKiosk.Contracts.Kiosk.Inventory;
public class InventoryRequest
{
    public string? DeviceId { get; set; }
    public string? ProductId { get; set; }
    public int Slot { get; set; }
    public int Quantity { get; set; }
}
