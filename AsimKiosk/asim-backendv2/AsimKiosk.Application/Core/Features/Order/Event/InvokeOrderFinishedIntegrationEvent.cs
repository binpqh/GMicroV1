using AsimKiosk.Application.Core.Abstractions.Notification;
using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Events;

namespace AsimKiosk.Application.Core.Features.Order.Event;

public class InvokeOrderFinishedIntegrationEvent(IIntegrationEventInvoker integrationEventInvoker) : IDomainEventHandler<OrderCompletedEvent>
{
    public async Task Handle(OrderCompletedEvent notification, CancellationToken cancellationToken)
    {
        await integrationEventInvoker.UpdateInventoriesOnOrderAsync(notification.Order, notification.ErrorDictionary);
    }
}
