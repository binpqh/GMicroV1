using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Events;

public class MaintenanceCreatedDomainEvent(Maintenance maintenance) : IDomainEvent
{
    public Maintenance Maintenance {get;} = maintenance;
}