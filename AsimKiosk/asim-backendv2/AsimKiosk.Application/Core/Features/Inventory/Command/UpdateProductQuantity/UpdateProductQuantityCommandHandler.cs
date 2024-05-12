using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Inventory.Command.UpdateProductQuantity;

public class UpdateProductQuantityCommandHandler(
        IUserIdentifierProvider currentUser,
        IWarehouseTicketRepository warehouseTicketRepository
    )
    : ICommandHandler<UpdateProductQuantityCommand, Result>
{
    public async Task<Result> Handle(UpdateProductQuantityCommand request, CancellationToken cancellationToken)
    {
        var ticket = await warehouseTicketRepository.GetByIdAsync(request.TicketId);
        if (ticket.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Ticket));
        }

        if ((currentUser.Role!.Equals("User") && currentUser.NameIdentifier != ticket.Value.CreatorId) ||
            (currentUser.Role.Equals("ManagerGroup") && currentUser.GroupId != ticket.Value.GroupId))
        {
            return Result.Failure(DomainErrors.Permission.InvalidPermissions);
        }

        var productQuantity = ticket.Value.ProductQuantities.FirstOrDefault(p => p.DispenserSlot == request.Slot);
        if (productQuantity == null)
        {
            return Result.Failure(DomainErrors.WarehouseTicket.InvalidSlot);
        }

        if (productQuantity.CompletionState.Equals("Completed"))
        {
            return Result.Failure(DomainErrors.WarehouseTicket.AlreadyHandled);
        }

        productQuantity.ItemCode = !string.IsNullOrEmpty(request.Request.ItemCode) ? request.Request.ItemCode : productQuantity.ItemCode;
        productQuantity.Quantity = request.Request.Quantity != productQuantity.Quantity ? request.Request.Quantity : productQuantity.Quantity;
        productQuantity.From = request.Request.From;
        productQuantity.To = request.Request.To;

        return Result.Success();
    }
}