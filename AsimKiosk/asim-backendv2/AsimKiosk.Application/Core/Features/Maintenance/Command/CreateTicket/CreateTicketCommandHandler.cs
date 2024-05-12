using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Maintenance.Command.CreateTicket;

public class CreateTicketCommandHandler(IMaintenanceRepository maintenanceRepository, IKioskRepository kioskRepository,IUserIdentifierProvider user,IUserRepository userRepository) : ICommandHandler<CreateTicketCommand, Result>
{
    public async Task<Result> Handle(CreateTicketCommand  request, CancellationToken cancellationToken)
    {
        var kiosk = await kioskRepository.GetActiveKioskByAndroidIdAsync(request.Request.DeviceId);
        if (kiosk.HasNoValue)
        {
            return Result.Failure(DomainErrors.Kiosk.NotFound);
        }
        var userInfo =await userRepository.GetByIdAsync(user.NameIdentifier!.ToString());
        var nameUser = "Unknown";
        if (userInfo.HasValue) nameUser = userInfo.Value.Username;

        var ticket = Domain.Entities.Maintenance.Create(request.Request.ErrorCode,
        request.Request.DeviceId,kiosk.Value.KioskName, kiosk.Value.GroupId,nameUser);
        ticket.Note = request.Request.Note;

        maintenanceRepository.Insert(ticket);
        return Result.Success();
    }
}