using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Events;

namespace AsimKiosk.Application.Core.Features.Kiosk.Event;

internal class InvokeKioskCreatedEvent(IKioskHub kioskHub) : IDomainEventHandler<KioskCreatedDomainEvent>
{
    public async Task Handle(KioskCreatedDomainEvent notification, CancellationToken cancellationToken)
    {
        await kioskHub.SendSecretKey(notification.Kiosk.DeviceId);
    }
}
