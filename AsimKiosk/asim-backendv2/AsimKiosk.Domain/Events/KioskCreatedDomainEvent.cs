using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Events;

public class KioskCreatedDomainEvent(Kiosk kiosk) : IDomainEvent
{
    public Kiosk Kiosk { get; set; } = kiosk;
}
