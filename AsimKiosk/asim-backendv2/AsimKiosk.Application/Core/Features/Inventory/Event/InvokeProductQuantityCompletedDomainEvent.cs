using AsimKiosk.Application.Core.Abstractions.Notification;
using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Events;

namespace AsimKiosk.Application.Core.Features.Inventory.Event
{
    internal class InvokeProductQuantityCompletedDomainEvent(IIntegrationEventInvoker integrationEventInvoker)
        : IDomainEventHandler<TicketProductQuantityCompletedEvent>
    {
        public async Task Handle(TicketProductQuantityCompletedEvent notification, CancellationToken cancellationToken)
        {
            await integrationEventInvoker.CreateNewSIMStorageOnWarehouseTicketCompletion(notification.Ticket, notification.Slot);
        }
    }
}
