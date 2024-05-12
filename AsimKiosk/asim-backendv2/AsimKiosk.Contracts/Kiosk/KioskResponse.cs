namespace AsimKiosk.Contracts.Kiosk;

public class KioskResponse
{
    public string DeviceId { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public string HealthStatus { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string GroupId { get; set; } = string.Empty;
    public string GroupName { get; set; } = string.Empty;
    public string StoreCode { get; set; } = string.Empty;
}
public class KioskLogResponse
{
    public string DeviceId { get; set; } = string.Empty;
    public string KioskName { get; set; } = string.Empty;
    public string GroupName { get; set; } = string.Empty;
    public int NumberOfLogs { get; set; }
}
public class KioskGeneralDetails : KioskResponse
{
    public List<ExternalDevice> ExternalDevices { get; set; } = new List<ExternalDevice>();
    public string Address { get; set; } = string.Empty;
    public string POSCodeTerminal { get; set; } = string.Empty;
    public string ConfigId { get; set; } = string.Empty;
}

public class KioskDetailsResponse : KioskResponse
{
    public List<PeripheralKiosk> Peripherals { get; set; } = new List<PeripheralKiosk>();
    public List<InventoryKiosk> Inventories { get; set; } = new List<InventoryKiosk>();
}

public class PeripheralKiosk
{
    public string Id { get; set; } = string.Empty;
    public string PeripheralName { get; set; } = string.Empty;
    public string HealStatus { get; set; } = string.Empty;
}
public class InventoryKiosk
{
    public string ItemCode { get; set; } = string.Empty;
    public int Slot { get; set; }
    public int Quantity { get; set; }
    public bool IsActive { get; set; }
}

public class ExternalDevice
{
    public string Id { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public int DispenserSlot { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public string ProductCode { get; set; } = string.Empty;
    public string ItemCode { get; set; } = string.Empty;
    public bool HasSerialNumbers { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Health { get; set; } = string.Empty;
}

public class KioskDropdownResponse
{
    public string DeviceId { get; set; } = string.Empty;
    public string KioskName { get; set; } = string.Empty;
    public string GroupId { get; set; } = string.Empty;
    public string GroupName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class GroupKioskDropDownResponse
{
    public string GroupId { get; set; } = string.Empty;
    public string GroupName { get; set; } = string.Empty;
    public List<GroupKiosk> Kiosks { get; set; } = [];
}

public class GroupKiosk
{
    public string DeviceId { get; set; } = string.Empty;
    public string KioskName { get; set; } = string.Empty;
    public string GroupId { get; set; } = string.Empty;
}
public class KioskInventoryResponse
{
    public string DeviceId { get; set; } = string.Empty;
    public string KioskName { get; set; } = string.Empty;
    public string GroupId { get; set; } = string.Empty;
    public string GroupName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public List<InventoryItem> Dispensers { get; set; } = [];

}

public class InventoryItem
{
    public string Id { get; set; } = string.Empty;
    public string? ItemCode { get; set; }
    public string? ItemName { get; set; }
    public int DispenserSlot { get; set; }
    public int Quantity { get; set; }
    public int ErrorQuantity { get; set; }
    public bool HasSerialNumbers { get; set; }
    public int SpaceRemaining { get; set; }
    public bool IsLow { get; set; }
    public bool Active { get; set; }
}