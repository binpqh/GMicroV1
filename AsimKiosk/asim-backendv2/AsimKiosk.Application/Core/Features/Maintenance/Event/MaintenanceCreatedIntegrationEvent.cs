using AsimKiosk.Application.Core.Abstractions.Notification;
using AsimKiosk.Domain.Events;

namespace AsimKiosk.Application.Core.Features.Maintenance.Event;
public class MaintenanceCreatedIntegrationEvent(MaintenanceCreatedDomainEvent maintenanceCreatedDomainEvent)
    : IIntegrationEvent
{
    public string MaintenanceId { get; } = maintenanceCreatedDomainEvent.Maintenance.Id.ToString();
}
