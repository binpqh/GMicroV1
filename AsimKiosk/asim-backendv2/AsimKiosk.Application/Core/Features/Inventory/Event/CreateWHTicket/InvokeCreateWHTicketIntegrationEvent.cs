using AsimKiosk.Application.Core.Abstractions.Notification;
using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Events;

namespace AsimKiosk.Application.Core.Features.Inventory.Event.CreateWHTicket;

public class InvokeCreateWHTicketIntegrationEvent(IIntegrationEventInvoker invoker) : 
    IDomainEventHandler<WarehouseTicketCreatedDomainEvent>
{
    public async Task Handle(WarehouseTicketCreatedDomainEvent notification, CancellationToken cancellationToken)
    {
        await invoker.NotifyWHTicketToUserAysnc(notification.Ticket);
    }
}
