using AsimKiosk.Application.Core.Abstractions.Notification;
using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Events;

namespace AsimKiosk.Application.Core.Features.Maintenance.Event
{
    public class MaintenanceCreatedIntegrationEventHandler(IIntegrationEventInvoker integrationEventInvoker)
        : IDomainEventHandler<MaintenanceCreatedDomainEvent>
    {
        public async Task Handle(MaintenanceCreatedDomainEvent notification, CancellationToken cancellationToken)
            => await integrationEventInvoker.NotifyMaintenanceToUserAsync(notification.Maintenance);
    }
}