using AsimKiosk.Application.Core.Features.Notification.Command.CreateNotificationForGroup;
using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Events;
using MediatR;

namespace AsimKiosk.Application.Core.Features.LocalSimAPIs.Event;

internal class LocalSimAPIUpdatedEventHandler(IMediator mediator, IKioskHub kioskHub) : IDomainEventHandler<LocalSimAPIUpdatedDomainEvent>
{
    public async Task Handle(LocalSimAPIUpdatedDomainEvent notification, CancellationToken cancellationToken)
    {
        var createNotiCommand = new CreateNotificationForGroupCommand(null, notification.UpdateBy, ParentNavigate.LocalSimConfig, TypeNotify.Changes, notification.LocalSimConfig.Id.ToString());
        var noti = await mediator.Send(createNotiCommand);
        await kioskHub.NotifyPaymentConfigAysnc(noti.Value);
    }
}
