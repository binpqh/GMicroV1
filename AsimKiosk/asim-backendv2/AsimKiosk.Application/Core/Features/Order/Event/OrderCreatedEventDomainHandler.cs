using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Events;

namespace AsimKiosk.Application.Core.Features.Order.Event;

internal class OrderCreatedEventDomainHandler : IDomainEventHandler<OrderCreatedEventDomain>
{
    public Task Handle(OrderCreatedEventDomain notification, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
