
namespace AsimKiosk.Contracts.Kiosk.Inventory;

public record InventoryKioskResult
{
    public string? PeripheralCode { get; set; }

    // Dispenser mới đúng, follow theo value object inventory.
    public int DispenderSlot { get; set; }
    public bool IsActived { get; set; } = false;
    public bool IsAvailable { get; set; } = false;

    public string? ItemName { get; set; }
    public string? ItemCode { get; set; }
    public string? ProductCode { get; set; }

    public InventoryKioskResult() { }
    public InventoryKioskResult(
        string peripheralCode,
        int slot,
        string itemName,
        string itemCode,
        string productCode)
    {
        this.PeripheralCode = peripheralCode;
        this.DispenderSlot = slot;
        this.ItemName = itemName;
        this.ItemCode = itemCode;
        this.ProductCode = productCode;
        this.IsActived = true;
        this.IsAvailable = true;
    }

    public static IEnumerable<InventoryKioskResult> GetMockData()
    {
        var defaultItem = new InventoryKioskResult("DI1", 1, "LOCAL SIM", "A65T", "LOCAL_SIM");
        var vnpassItem = defaultItem with
        {
            PeripheralCode = "DI3",
            DispenderSlot = 3,
            ProductCode = "VNPASS",
            ItemCode = "68",
            ItemName = "Vé bus 68"
        };
        return new List<InventoryKioskResult>()
        {
            defaultItem,
            defaultItem with { PeripheralCode = "DI2", DispenderSlot = 2, IsAvailable = false },
            vnpassItem,
            vnpassItem with {
                PeripheralCode = "DI4",
                ItemCode = "86",
                IsActived = false ,
                ItemName = "Vé bus 86",
                DispenderSlot = 4
            }
        };
    }
}