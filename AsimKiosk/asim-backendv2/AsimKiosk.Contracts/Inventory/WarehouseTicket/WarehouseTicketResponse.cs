using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.ValueObject;

namespace AsimKiosk.Contracts.Inventory.WarehouseTicket;

public class KioskTicketsResponse
{
    public string DeviceId { get; set; } = string.Empty;
    public string KioskName { get; set; } = string.Empty;
    public List<string> TicketIds { get; set; } = [];
}
public class WarehouseTicketResponse
{
    public string Id { get; set; } = string.Empty;
    public string DeviceId { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string KioskName { get; set; } = string.Empty;
    public string GroupName { get; set; } = string.Empty;
    public string CreatorName { get; set; } = string.Empty;
    public double CompletionProgress { get; set; }
    public int DispenserCount { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } 
}
public class WarehouseTicketDetails : WarehouseTicketResponse
{
    public string CreatorId { get; set; } = string.Empty;
    public string DocumentKey { get; set; } = string.Empty;
    public string ImageKey { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public List<ProductQuantityResponse> ProductQuantities { get; set; } = [];
    public List<ErrorQuantityResponse> ErrorQuantities { get; set; } = [];
    
}

public class ProductQuantityResponse
{
    public string ItemCode { get; set; } = string.Empty;
    public int DispenserSlot { get; set; }
    public int Quantity { get; set; }
    public string? AssigneeId { get; set; }
    public string Assignee { get; set; } = string.Empty;
    public DateTime? FinishedAt { get; set; }
    public string CompletionState { get; set; } = string.Empty;
    public long? From { get; set; }
    public long? To { get; set; }
    public string ConfirmationImage { get; set; } = string.Empty;
}

public class ErrorQuantityResponse
{
    public string ItemCode { get; set; } = string.Empty;
    public int DispenserSlot { get; set; }
    public int Quantity { get; set; }
    public string? AssigneeId { get; set; }
    public string Assignee { get; set; } = string.Empty;
    public DateTime? FinishedAt { get; set; }
    public string CompletionState { get; set; } = string.Empty;
    public List<string> ErrorSerialNumbers { get; set; } = [];
    public string ConfirmationImage { get; set; } = string.Empty;
}