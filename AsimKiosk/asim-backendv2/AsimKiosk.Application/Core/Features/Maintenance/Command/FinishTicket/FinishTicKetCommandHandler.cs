using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Core.TittleDescriptionNotification;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Maintenance.Command.FinishTicket;

public class FinishTicKetCommandHandler(IMaintenanceRepository maintenanceRepository,INotificationRepository notificationRepository,IUserRepository userRepository,IKioskHub kioskHub) : ICommandHandler<FinishTicketCommand,Result>
{
    public async Task<Result> Handle(FinishTicketCommand request, CancellationToken cancellationToken)
    {
        var ticket = await maintenanceRepository.GetByIdAsync(request.IdTicket);
        if (ticket.HasNoValue) return Result.Failure(DomainErrors.Maintenance.NotFoundWithId);
        ticket.Value.MaintenanceState = MaintenanceStatus.Completed.ToString();
        ticket.Value.FinishAt = DateTime.UtcNow;
        var user = await userRepository.GetByIdAsync(ticket.Value.Assignee);
        var noti = await notificationRepository.GetByIdChild(ticket.Value.Id.ToString());
        (string desc, string descVn) = TittleDESCNotification.NotifyInventoryTicketByUser(user.Value.Fullname);
        noti.Value.Description = desc;
        noti.Value.DescriptionVN = descVn;
        await kioskHub.NotifyTicketAysnc(noti.Value.GroupId , noti.Value);
        return Result.Success();
    }
}