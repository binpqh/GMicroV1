using AsimKiosk.Application.Core.Abstractions.Notification;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Application.Core.Features.Inventory.Event.CreateWHTicket;

public class CreateWHTicketDomainEvent(WarehouseTicket warehouseTicket) : IIntegrationEvent
{
    public string Id { get; set; } = warehouseTicket.Id.ToString();
    public string GroupId { get; set; } = warehouseTicket.GroupId;
}