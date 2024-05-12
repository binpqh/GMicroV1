using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.File;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Inventory.Command.ChangeProductQuantityStatus;

public class ChangeProductQuantityStatusCommandHandler(
        IWarehouseTicketRepository warehouseTicket,
        IUserIdentifierProvider currentUser,
        IFileService fileService,
        IKioskRepository kioskRepository
    ) 
    : ICommandHandler<ChangeProductQuantityStatusCommand, Result>
{
    public async Task<Result> Handle(ChangeProductQuantityStatusCommand request, CancellationToken cancellationToken)
    {
        var ticket = await warehouseTicket.GetByIdAsync(request.TicketId);
        if (ticket.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Ticket));
        }

        var kiosk = await kioskRepository.GetKioskAndroidIdAsync(ticket.Value.DeviceId);
        if (kiosk.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Kiosk));
        }

        if(currentUser.Role!.Equals("User") && currentUser.NameIdentifier != ticket.Value.CreatorId
        || currentUser.Role.Equals("ManagerGroup") && currentUser.GroupId != ticket.Value.GroupId)
        {
            return Result.Failure(DomainErrors.Permission.InvalidPermissions);
        }
        var tasks = new List<Task>();

        foreach (var bruh in request.Slots)
        { 
            tasks.Add(Task.Run(() => ChangeProductQuantityStatus(request, bruh, ticket, kiosk)));
        }
        await Task.WhenAll(tasks);
        var completedProductQuantities = ticket.Value.ProductQuantities.Where(p => p.CompletionState == "Completed");

        foreach (var productQuantity in completedProductQuantities)
        {
            if (request.Request.VerificationImage == null)
            {
                return Result.Failure(DomainErrors.WarehouseTicket.ImageRequired);
            }

            productQuantity.ConfirmationImageKey = fileService.SaveImage(request.Request.VerificationImage, ticket.Value.DeviceId, ImageType.Confirmation);
        }

        ticket.Value.CompletionProgress = CalculateCompletionRate(ticket.Value.ProductQuantities.Where(p => p.CompletionState != "Disabled").Count(),
                                            ticket.Value.ProductQuantities.Where(p => p.CompletionState == "Completed").Count());

        return Result.Success();
    }

    private async Task<Result> ChangeProductQuantityStatus(ChangeProductQuantityStatusCommand request, int slot, WarehouseTicket ticket, Domain.Entities.Kiosk kiosk)
    {
        var productQuantity = ticket.ProductQuantities.FirstOrDefault(p => p.DispenserSlot == slot);
        if (productQuantity == null)
        {
            return Result.Failure(DomainErrors.WarehouseTicket.InvalidSlot);
        }
        else
        {
            // check if the ticket product quantity is completed before editing
            if (productQuantity.CompletionState.Equals("Completed"))
            {
                return Result.Failure(DomainErrors.WarehouseTicket.AlreadyHandled);
            }
            (var remaining, var slotHasEnoughSpace) =
                await kioskRepository.IsSlotEnoughOfProductsAsync(kiosk.DeviceId, productQuantity.DispenserSlot, productQuantity.Quantity);

            if (!slotHasEnoughSpace)
            {
                return Result.Failure(DomainErrors.WarehouseTicket.SlotNotEnoughSpace(productQuantity.DispenserSlot, remaining));
            }
            // update product quantity status here
            productQuantity.CompletionState = request.Request.Status.ToString();
        }

        if (productQuantity.CompletionState.Equals("Completed"))
        {
            if (request.Request.VerificationImage == null)
            {
                return Result.Failure(DomainErrors.WarehouseTicket.ImageRequired);
            }

            kiosk.Inventories
                .Where(i => i.DispenserSlot == productQuantity.DispenserSlot)
                .Select(i => i.InventoryQuantity += productQuantity.Quantity)
                .First();

            productQuantity.AssigneeId = currentUser.NameIdentifier;
            productQuantity.FinishedAt = DateTime.UtcNow;
            WarehouseTicket.AddDispenserInventory(ticket, productQuantity.DispenserSlot);
        }
        return Result.Success();
    }

    private double CalculateCompletionRate(int totalDispensers, int completedDispensers)
    {
        double percentageCompletion = totalDispensers == 0 ? 0.00 : Math.Round((double)completedDispensers / totalDispensers * 100, 2);
        return percentageCompletion;
    }
}
