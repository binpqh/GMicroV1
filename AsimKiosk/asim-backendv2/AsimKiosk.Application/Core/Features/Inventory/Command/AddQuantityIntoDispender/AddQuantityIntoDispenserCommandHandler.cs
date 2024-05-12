using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Inventory.Command.AddQuantityIntoDispenser;

internal class AddQuantityIntoDispenserCommandHandler(IKioskRepository kioskRepository)
    : ICommandHandler<AddQuantityIntoDispenserCommand, Result>
{
    public async Task<Result> Handle(AddQuantityIntoDispenserCommand request, CancellationToken cancellationToken)
    {
        var kiosk = await kioskRepository.GetActiveKioskByAndroidIdAsync(request.DeviceId);
        if (!await kioskRepository.IsKioskContainItemAsync(request.DeviceId,request.ItemCode))
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Item));
        }
        if (kiosk.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Kiosk));
        }
        (int numAvailable, bool isEnough) = await kioskRepository.IsSlotEnoughOfProductsAsync(request.DeviceId, request.SlotDispenser, request.Quantity);
        if (!isEnough)
        {
            return Result.Failure(DomainErrors.Inventory.NotEnoughSlotToImport(numAvailable));
        }
        var inventory = await kioskRepository.GetInventoryByDeviceIdAndNumberSlotAsync(request.DeviceId, request.ItemCode, request.SlotDispenser);
        inventory.Value.InventoryQuantity = inventory.Value.InventoryQuantity + request.Quantity;
        kiosk.Value.Inventories
            .Where(i => i.DispenserSlot == request.SlotDispenser)
            .Select(i => i.InventoryQuantity += request.Quantity).First();
        return Result.Success();
    }
}