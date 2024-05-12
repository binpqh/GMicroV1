using AsimKiosk.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace AsimKiosk.Contracts.Inventory.WarehouseTicket;

public class WarehouseTicketRequest
{
    public string DeviceId { get; set; } = string.Empty;
    public string GroupId { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public List<ProductQuantityRequest> ProductQuantities { get; set; } = [];
    public IFormFile? TicketFile { get; set; }
}

public class ProductQuantityRequest
{
    public string ItemCode { get; set; } = string.Empty;
    public int DispenserSlot { get; set; }
    public int Quantity { get; set; }
    public long? From { get; set; }
    public long? To { get; set; }
}

public class UpdateProductQuantityRequest
{
    public string ItemCode { get; set; } = string.Empty;
    public string ItemName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public long? From { get; set; }
    public long? To { get; set; }
}

public class UpdateWarehouseTicketRequest
{
    public string? Description { get; set; }
    public IFormFile? TicketFile { get; set; }
}

public class ChangeTicketDispenserStatusRequest
{
    public IFormFile? VerificationImage { get; set; }
    public CompletionStatus Status { get; set; }
}