using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Maintenance.Command.DeleteTicket;
public class DeleteTickecCommandHandler(IMaintenanceRepository maintenanceRepository) : ICommandHandler<DeleteTicketCommand, Result>
{
    public async Task<Result> Handle(DeleteTicketCommand request, CancellationToken cancellationToken)
    {
        var ticket = await maintenanceRepository.GetByIdAsync(request.Id);
        if (ticket.HasNoValue) return Result.Failure(DomainErrors.Maintenance.NotFoundWithId);
        if (ticket.Value.MaintenanceState != "Completed") return Result.Failure(DomainErrors.Maintenance.CanNotDelete);
        ticket.Value.Status = ActiveStatus.Inactive.ToString();
        //await maintenanceRepository.RemoveAsync(ticket);
        return Result.Success();
    }
}