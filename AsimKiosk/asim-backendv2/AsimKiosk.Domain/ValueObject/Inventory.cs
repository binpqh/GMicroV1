namespace AsimKiosk.Domain.ValueObject;

public class Inventory
{
    public string ProductCode { get; set; } = string.Empty;
    public string ItemCode { get; set; } = string.Empty;
    public int DispenserSlot { get; set; }
    public int InventoryQuantity { get; set; }
    public int ErrorQuantity { get; set; }
    public bool HasSerialNumbers { get; set; } = false;
    public bool IsActive { get; set; }
    public DateTime ModifiedOn { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
