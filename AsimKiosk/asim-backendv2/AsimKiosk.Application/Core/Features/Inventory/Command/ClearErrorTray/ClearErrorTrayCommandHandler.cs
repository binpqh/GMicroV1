using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.File;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Inventory.Command.ClearErrorTray;

public class ClearErrorTrayCommandHandler(
    IKioskRepository kioskRepository, 
    IWarehouseTicketRepository warehouseTicketRepository, 
    IUserIdentifierProvider currentUser,
    IFileService fileService) : ICommandHandler<ClearErrorTrayCommand, Result>
{
    public async Task<Result> Handle(ClearErrorTrayCommand request, CancellationToken cancellationToken)
    {
        var ticket = await warehouseTicketRepository.GetByIdAsync(request.TicketId);
        if (ticket.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundObject);
        }
        var kiosk = await kioskRepository.GetKioskAndroidIdAsync(ticket.Value.DeviceId);
        if (kiosk.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Kiosk));
        }

        if (currentUser.Role!.Equals("User") && currentUser.NameIdentifier != ticket.Value.CreatorId
        || currentUser.Role.Equals("ManagerGroup") && currentUser.GroupId != ticket.Value.GroupId)
        {
            return Result.Failure(DomainErrors.Permission.InvalidPermissions);
        }
        var tasks = new List<Task>();
        foreach (var bruh in request.Slots)
        {
            tasks.Add(Task.Run(() => ChangeErrorQuantityStatus(request, bruh, ticket, kiosk)));
        }
        await Task.WhenAll(tasks);

        var completedQuantities = ticket.Value.ErrorQuantities.Where(p => p.CompletionState == "Completed");
        foreach (var error in completedQuantities)
        {
            if (request.Request.VerificationImage == null)
            {
                return Result.Failure(DomainErrors.WarehouseTicket.ImageRequired);
            }
            error.ConfirmationImageKey = fileService.SaveImage(request.Request.VerificationImage, ticket.Value.DeviceId, ImageType.Confirmation);
        }

        ticket.Value.CompletionProgress = CalculateCompletionRate(ticket.Value.ErrorQuantities.Where(p => p.CompletionState != "Disabled").Count(),
                                            ticket.Value.ErrorQuantities.Where(p => p.CompletionState == "Completed").Count());

        return Result.Success();
    }

    private Result ChangeErrorQuantityStatus(ClearErrorTrayCommand request, int slot, WarehouseTicket ticket, Domain.Entities.Kiosk kiosk)
    {
        var errorQuantity = ticket.ErrorQuantities.FirstOrDefault(e => e.DispenserSlot == slot);
        if (errorQuantity == null)
        {
            return Result.Failure(DomainErrors.WarehouseTicket.InvalidSlot);
        }
        else
        {
            var inventory = kiosk.Inventories.First(i => i.DispenserSlot == slot);
            // check if the ticket product quantity is completed before editing
            if (errorQuantity.CompletionState.Equals("Completed"))
            {
                return Result.Failure(DomainErrors.WarehouseTicket.AlreadyHandled);
            }
            errorQuantity.CompletionState = request.Request.Status.ToString();

            if (errorQuantity.CompletionState.Equals("Completed"))
            {
                if (request.Request.VerificationImage == null)
                {
                    return Result.Failure(DomainErrors.WarehouseTicket.ImageRequired);
                }
                errorQuantity.AssigneeId = currentUser.NameIdentifier;
                inventory.ErrorQuantity = 0;
                errorQuantity.FinishedAt = DateTime.UtcNow;
            }
        }
        return Result.Success();
    }

    private double CalculateCompletionRate(int totalDispensers, int completedDispensers)
    {
        double percentageCompletion = totalDispensers == 0 ? 0.00 : Math.Round((double)completedDispensers / totalDispensers * 100, 2);
        return percentageCompletion;
    }
}
