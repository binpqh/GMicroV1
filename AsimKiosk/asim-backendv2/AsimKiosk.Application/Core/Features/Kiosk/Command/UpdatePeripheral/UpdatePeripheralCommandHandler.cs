using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Kiosk.Command.UpdatePeripheral;

public class UpdatePeripheralCommandHandler(IKioskRepository kioskRepository)
    : ICommandHandler<UpdatePeripheralCommand, Result>
{
    public async Task<Result> Handle(UpdatePeripheralCommand request, CancellationToken cancellationToken)
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

        //Path == COM port
        List<string> kioskCOMPorts = kiosk.Value.Peripherals.Where(x => x.Path != null).Select(x => x.Path!).ToList();

        if (!string.IsNullOrEmpty(request.PeripheralRequest.Path) && peripheral.Path != request.PeripheralRequest.Path)
        {
            if(kioskCOMPorts.Contains(request.PeripheralRequest.Path))
            return Result.Failure(DomainErrors.Kiosk.COMPortNotUnique);
        }

        peripheral.Path = string.IsNullOrEmpty(request.PeripheralRequest.Path) ? peripheral.Path : request.PeripheralRequest.Path;

        // Update kiosk inventory

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
            inventoryToEdit.HasSerialNumbers = request.PeripheralRequest.HasSerialNumbers;
            inventoryToEdit.ProductCode = request.PeripheralRequest.ProductCode;
            inventoryToEdit.ItemCode = request.PeripheralRequest.ItemCode;
        }

        return Result.Success();
    }
}
