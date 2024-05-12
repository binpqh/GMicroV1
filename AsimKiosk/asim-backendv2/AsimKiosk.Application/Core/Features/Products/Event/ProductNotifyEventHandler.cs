using AsimKiosk.Application.Core.Abstractions.Notification;
using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Events;

namespace AsimKiosk.Application.Core.Features.Products.Event;

public class ProductNotifyEventHandler(IIntegrationEventInvoker integrationEventInvoker)
        : IDomainEventHandler<ProductNotifyDomainEvent>
{
    public Task Handle(ProductNotifyDomainEvent notification, CancellationToken cancellationToken)
        => integrationEventInvoker.NotifyProductUpdatedAysnc(notification.Product,notification.UserModifiedId);
}
