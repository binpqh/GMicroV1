using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace AsimKiosk.Application.Core.Features.Order.Command.UpdateInventory;

public class UpdateInventoryOnOrderCommandHander(
    IKioskRepository kioskRepository,
    ICardStorageRepository cardStorageRepository,
    IWarehouseTicketRepository warehouseTicketRepository,
    ILogger<UpdateInventoryOnOrderCommandHander> logger
    ) : ICommandHandler<UpdateInventoryOnOrderCommand, Result>
{
    public async Task<Result> Handle(UpdateInventoryOnOrderCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("[PROCESS OUT CARD] 1. In handler update inventory event");
        var kiosk = await kioskRepository.GetKioskAndroidIdAsync(request.Order.DeviceId);
        if (kiosk.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundObject);
        }

        // TODO: convert to dynamic item code following product code == LOCAL_SIM
        if (request.Order.ItemCode != "A65T")
        {
            return Result.Success();
        }

        var serialList = request.Order.SerialNumber.Count > 0 ? request.Order.SerialNumber.Select(x => Convert.ToInt64(x)).ToList() : new();
        var errorList = request.Order.ErrorSerialNumber.Count > 0 ? request.Order.ErrorSerialNumber.Select(x => Convert.ToInt64(x)).ToList() : new();
        foreach (var serial in serialList)
        {
            logger.LogInformation("[PROCCESS OUT CARD] 2.1 checking serial list ...");
            var card = await cardStorageRepository.GetByDeviceIdAndSerialCardAsync(kiosk.Value.DeviceId, serial);
            if (card.HasValue)
            {
                logger.LogInformation("[PROCCESS OUT CARD] 2.2 found seri in card stores ...");
                card.Value.StorageState = StorageStatus.Sold.ToString();
                card.Value.ModifiedOn = DateTime.UtcNow;
                var dispenser = kiosk.Value.Inventories.Where(i => i.DispenserSlot == card.Value.Slot).FirstOrDefault();
                if (dispenser != null)
                {
                    logger.LogInformation("[PROCCESS OUT CARD] 2.3 update quantity in card stores ...");
                    dispenser.InventoryQuantity -= 1;
                }
            }
        }

        // foreach (var serial in errorList)
        // {
        //     logger.LogInformation("[PROCCESS OUT CARD] 3.1 checking error list ...");
        //     var card = await cardStorageRepository.GetByDeviceIdAndSerialCardAsync(kiosk.Value.DeviceId, serial);
        //     if (card.HasValue)
        //     {
        //         logger.LogInformation("[PROCCESS OUT CARD] 3.2 found seri in card stores ...");
        //         card.Value.StorageState = StorageStatus.Error.ToString();
        //         card.Value.ModifiedOn = DateTime.UtcNow;

        //     }
        // }

        foreach (var error in request.ErrorDictionary)
        {
            logger.LogInformation("[PROCCESS OUT CARD] 3.1 checking err dict ...");
            var dispenser = kiosk.Value.Inventories.Where(i => i.DispenserSlot == error.Key).FirstOrDefault();
            if (dispenser != null)
            {
                logger.LogInformation("[PROCCESS OUT CARD] 3.2 found seri in card stores ...");
                dispenser.InventoryQuantity -= error.Value.Count;
                dispenser.ErrorQuantity += error.Value.Count;
            }
        }

        // if (kiosk.Value.Inventories.Any(i => i.ErrorQuantity >= 20))
        // {
        //     var errorQuantities = new List<ErrorQuantity>();
        //     foreach (var dispenser in kiosk.Value.Inventories)
        //     {
        //         if (dispenser.ErrorQuantity > 0)
        //         {
        //             var errorQuantity = new ErrorQuantity
        //             {
        //                 DispenserSlot = dispenser.DispenserSlot,
        //                 ItemCode = dispenser.ItemCode,
        //                 Quantity = dispenser.ErrorQuantity,
        //                 ErrorSerialNumbers = request.ErrorDictionary.GetValueOrDefault(dispenser.DispenserSlot, []),
        //             };
        //             errorQuantities.Add(errorQuantity);
        //         }
        //     }
        //      var errorTicket = WarehouseTicket.Create(
        //          TicketType.ErrorTray,
        //          kiosk.Value.DeviceId,
        //          string.Empty,
        //          "System",
        //          "One or more error trays is nearing limit, please send maintenance to reset error trays.",
        //          [],
        //          errorQuantities);
        //      warehouseTicketRepository.Insert(errorTicket);
        // }

        return Result.Success();
    }
}
