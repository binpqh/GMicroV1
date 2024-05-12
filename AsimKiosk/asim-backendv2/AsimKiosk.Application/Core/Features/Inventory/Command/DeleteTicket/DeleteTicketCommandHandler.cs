using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using MongoDB.Driver;

namespace AsimKiosk.Application.Core.Features.Inventory.Command.DeleteTicket;

public class DeleteTicketCommandHandler(IUserIdentifierProvider currentUser, IWarehouseTicketRepository warehouseTicketRepository) : ICommandHandler<DeleteTicketCommand, Result>
{
    public async Task<Result> Handle(DeleteTicketCommand request, CancellationToken cancellationToken)
    {
        var ticket = await warehouseTicketRepository.GetByIdAsync(request.TicketId);
        if (ticket.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Ticket));
        }
        if (ticket.Value.CompletionProgress > 0 && ticket.Value.CompletionProgress <= 100)
        {
            return Result.Failure(DomainErrors.WarehouseTicket.TicketInProgress);
        }

        if (currentUser.Role!.Equals("User") && currentUser.NameIdentifier != ticket.Value.CreatorId)
        {
            return Result.Failure(DomainErrors.Permission.InvalidPermissions);
        }

        if (currentUser.Role.Equals("ManagerGroup") && currentUser.GroupId != ticket.Value.GroupId)
        {
            return Result.Failure(DomainErrors.Permission.InvalidPermissions);
        }

        if (!(currentUser.Role.Equals("Superman") || currentUser.Role.Equals("Administrator")))
        {
            return Result.Failure(DomainErrors.Permission.InvalidPermissions);
        }

        await warehouseTicketRepository.RemoveAsync(ticket);
        return Result.Success();
    }
}
