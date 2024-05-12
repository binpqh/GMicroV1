using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.File;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using AsimKiosk.Domain.ValueObject;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Inventory.Command.CreateWarehouseTicket;

public class CreateWarehouseTicketCommandHandler(
        IFileService fileService,
        IKioskRepository kioskRepository,
        IUserIdentifierProvider currentUser,
        IWarehouseTicketRepository warehouseTicket
    ) 
    : ICommandHandler<CreateWarehouseTicketCommand, Result>
{
    public async Task<Result> Handle(CreateWarehouseTicketCommand request, CancellationToken cancellationToken)
    {
        var kiosk = await kioskRepository.GetKioskAndroidIdAsync(request.Request.DeviceId);
        if (kiosk.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject("The kiosk with android's specified identifier wasn't found in our system."));
        }

        foreach (var entry in request.Request.ProductQuantities)
        {
            (var invalidSlot, var invalidCode) = await kioskRepository.GetInvalidSlotItemAsync(request.Request.DeviceId, entry.DispenserSlot, entry.ItemCode);
            if (invalidSlot != null && invalidCode != null)
            {
                return Result.Failure(DomainErrors.WarehouseTicket.InvalidItemCode(invalidSlot.Value, invalidCode));
            }

            (var remaining, var slotHasEnoughSpace)  
               = await kioskRepository.IsSlotEnoughOfProductsAsync(request.Request.DeviceId, entry.DispenserSlot, entry.Quantity);

            if (!slotHasEnoughSpace)
            {
                return Result.Failure(DomainErrors.WarehouseTicket.SlotNotEnoughSpace(entry.DispenserSlot, remaining));
            }
        }

        var productQuantities = request.Request.ProductQuantities.Adapt<List<ProductQuantity>>();

        
        
        var ticket = WarehouseTicket.Create(
            TicketType.Inventory,
            request.Request.DeviceId,
            string.IsNullOrWhiteSpace(currentUser.GroupId) ? request.Request.GroupId : currentUser.GroupId,
            currentUser.NameIdentifier!,
            request.Request.Description,
            productQuantities,
            []);

        if (request.Request.TicketFile != null)
        {
            (var key, var type) = fileService.SaveTicketDocument(request.Request.TicketFile, kiosk.Value.DeviceId);
            if (type.Equals(UploadType.Document.ToString()))
            {
                ticket.DocumentKey = key;
                ticket.ImageKey = string.Empty;
            }
            else
            {
                ticket.DocumentKey = string.Empty;
                ticket.ImageKey = key;
            }
        }

        warehouseTicket.Insert(ticket);
        return Result.Success();
    }
}