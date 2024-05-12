using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Core.TittleDescriptionNotification;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Maintenance.Command.UpdateTicketStatus;
public class UpdateTicketCommandHandler(IMaintenanceRepository maintenanceRepository,IKioskHub kioskHub, IUserRepository userRepository,INotificationRepository notificationRepository) : ICommandHandler<UpdateTicketCommand, Result>
{
    public async Task<Result> Handle(UpdateTicketCommand request, CancellationToken cancellationToken)
    {
        var ticket = await maintenanceRepository.GetByIdAsync(request.IdTicket);
        if (ticket.HasNoValue)
        {
            return Result.Failure(DomainErrors.Maintenance.NotFoundWithId);
        }
        var user = await userRepository.GetByIdAsync(request.UpdateMaintenaceRequest.Assignee);
        if (user.HasNoValue) 
        { 
            ticket.Value.Assignee = "Unknow"; 
        }
        else 
        { 
            ticket.Value.Assignee = user.Value.Fullname;
            var noti = await notificationRepository.GetByIdChild(ticket.Value.Id.ToString());
            (string desc, string descVn) = TittleDESCNotification.NotifyInventoryTicketByUser(user.Value.Fullname);
            noti.Value.Description = desc;
            noti.Value.DescriptionVN = descVn;
            await kioskHub.NotifyTicketAssignedAysnc(request.UpdateMaintenaceRequest.Assignee, noti.Value);
        }
        ticket.Value.Note = string.IsNullOrWhiteSpace(request.UpdateMaintenaceRequest.Note) ? ticket.Value.Note : request.UpdateMaintenaceRequest.Note;
        ticket.Value.MaintenanceState = MaintenanceStatus.Processing.ToString();
        return Result.Success();
    }
}