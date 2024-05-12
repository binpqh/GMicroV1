using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Kiosk.Command.ChangePeripheralStatus;

public class ChangePeripheralStatusCommandHandler(
        IKioskRepository kioskRepository
    ) : ICommandHandler<ChangePeripheralStatusCommand, Result>
{
    public async Task<Result> Handle(ChangePeripheralStatusCommand request, CancellationToken cancellationToken)
    {
        var kiosk = await kioskRepository.GetKioskAndroidIdAsync(request.DeviceId);
        if (kiosk.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Kiosk));
        }
        
        var peripheral = kiosk.Value.Peripherals.FirstOrDefault(x => x.Id == request.PeripheralId);
        if (peripheral == null)
        {
            return Result.Failure(DomainErrors.Kiosk.PeripheralNotExist);
        }

        peripheral.Status = request.Status.ToString() != peripheral.Status
                                ? request.Status.ToString()
                                : peripheral.Status;

        var inventoryToEdit = kiosk.Value.Inventories.FirstOrDefault(i =>
        {
            switch (peripheral.Code.ToUpper())
            {
                case "DI1":
                    return i.DispenserSlot == 1;
                case "DI2":
                    return i.DispenserSlot == 2;
                case "DI3":
                    return i.DispenserSlot == 3;
                case "DI4":
                    return i.DispenserSlot == 4;
                default:
                    return false; // Handle other cases as needed
            }
        });

        if (inventoryToEdit != null)
        {
            inventoryToEdit.IsActive = request.Status == ActiveStatus.Active ? true : false;
        }

        return Result.Success();
    }
}
