using AsimKiosk.Domain.Core.Abstractions;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Events;
using AsimKiosk.Domain.ValueObject;
using System.ComponentModel.DataAnnotations.Schema;

namespace AsimKiosk.Domain.Entities;

[Table("WarehouseTicket")]
public class WarehouseTicket() : AggregateRoot, IAuditableEntity, ISoftDeletableEntity
{
    public string DeviceId { get; set; } = null!;
    public string GroupId { get; set; } = string.Empty;
    public string CreatorId { get; set; } = null!;
    /// <summary>
    /// 100 = complete
    /// </summary>
    public double CompletionProgress { get; set; }
    public string Status { get; set; } = ActiveStatus.Active.ToString();
    public string? Description { get; set; }

    public string? DocumentKey { get; set; }
    public string? ImageKey { get; set; }
    public string Type { get; set; } = TicketType.Inventory.ToString();
    public List<ProductQuantity> ProductQuantities { get; set; } = [];
    public List<ErrorQuantity> ErrorQuantities { get; set; } = [];
    public DateTime? ModifiedOn { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedOn { get; set; }

    public static WarehouseTicket Create(
        TicketType type,
        string deviceId,
        string groupId,
        string creator,
        string? description,
        List<ProductQuantity> productQuantities,
        List<ErrorQuantity> errorQuantities)
    {
        var ticket = new WarehouseTicket
        {
            Type = type.ToString(),
            DeviceId = deviceId,
            GroupId = groupId,
            CreatorId = creator,
            Description = description,
            ProductQuantities = productQuantities,
            ErrorQuantities = errorQuantities
        };
        ticket.AddDomainEvent(new WarehouseTicketCreatedDomainEvent(ticket));

        return ticket;
    }
    public static void AddDispenserInventory(WarehouseTicket ticket, int slot)
    {
        ticket.AddDomainEvent(new TicketProductQuantityCompletedEvent(ticket, slot));
    }
}
