using AsimKiosk.Application.Core.Features.Notification.Command.CreateNotificationForGroup;
using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Events;
using MediatR;

namespace AsimKiosk.Application.Core.Features.ConfigPayment.Event;

internal class PaymentConfigUpdatedEventHandler(IMediator mediator,IKioskHub kioskHub) : IDomainEventHandler<PaymentConfigUpdateDomainEvent>
{
    public async Task Handle(PaymentConfigUpdateDomainEvent notification, CancellationToken cancellationToken)
    {
        var createNotiCommand = new CreateNotificationForGroupCommand(null,notification.UpdateBy,ParentNavigate.PaymentConfig,TypeNotify.Changes,notification.PaymentConfig.Id.ToString());
        var noti = await mediator.Send(createNotiCommand);
        await kioskHub.NotifyPaymentConfigAysnc(noti.Value);
    }
}
