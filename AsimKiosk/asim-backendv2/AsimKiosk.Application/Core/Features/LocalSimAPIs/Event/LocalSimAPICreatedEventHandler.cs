using AsimKiosk.Application.Core.Features.Notification.Command.CreateNotificationForGroup;
using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Events;
using MediatR;

namespace AsimKiosk.Application.Core.Features.LocalSimAPIs.Event;

internal class LocalSimAPICreatedEventHandler(IMediator mediator, IKioskHub kioskHub) : IDomainEventHandler<LocalSimAPICreatedDomainEvent>
{
    public async Task Handle(LocalSimAPICreatedDomainEvent notification, CancellationToken cancellationToken)
    {
        var createNotiCommand = new CreateNotificationForGroupCommand(null, notification.CreateBy, ParentNavigate.LocalSimConfig, TypeNotify.Created, notification.LocalSimConfig.Id.ToString());
        var noti = await mediator.Send(createNotiCommand);
        await kioskHub.NotifyPaymentConfigAysnc(noti.Value);
    }
}
