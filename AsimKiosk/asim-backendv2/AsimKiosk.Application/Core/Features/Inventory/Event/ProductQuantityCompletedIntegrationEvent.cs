using AsimKiosk.Application.Core.Abstractions.Notification;
using AsimKiosk.Domain.Events;
using MongoDB.Bson;

namespace AsimKiosk.Application.Core.Features.Inventory.Event;

public class ProductQuantityCompletedIntegrationEvent : IIntegrationEvent
{
    internal ProductQuantityCompletedIntegrationEvent(TicketProductQuantityCompletedEvent completedEvent)
    {
        TicketId = completedEvent.Ticket.Id;
        DispenserSlot = completedEvent.Slot;
    }
    public ObjectId TicketId { get; }
    public int DispenserSlot { get; }
}
