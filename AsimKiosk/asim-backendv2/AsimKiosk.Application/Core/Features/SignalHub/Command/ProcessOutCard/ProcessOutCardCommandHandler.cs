using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using AsimKiosk.Domain.ValueObject;
using Microsoft.Extensions.Logging;

namespace AsimKiosk.Application.Core.Features.SignalHub.Command.ProcessOutCard;

internal class ProcessOutCardCommandHandler(IOrderRepository orderRepository,
    ILogger<ProcessOutCardCommandHandler> logger,
    ICardStorageRepository cardStorageRepository,
    IMaintenanceRepository maintenanceRepository,
    IWarehouseTicketRepository warehouseTicketRepository,
    IKioskRepository kioskRepository) :
        ICommandHandler<ProcessOutCardCommand, Result>
{
    public async Task<Result> Handle(ProcessOutCardCommand request, CancellationToken cancellationToken)
    {
        if (request.CurrentSlot < 1 || request.CurrentSlot > 4)
        {
            return Result.Failure(DomainErrors.Inventory.InvalidSlot);
        }
        var order = await orderRepository.GetOrderByOrderCodeAsync(request.OrderCode);
        if (order.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundObject);
        }

        var kiosk = await kioskRepository.GetKioskAndroidIdAsync(order.Value.DeviceId);
        if (kiosk.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundObject);
        }

        var dispenser = kiosk.Value.Inventories.FirstOrDefault(i => i.DispenserSlot == request.CurrentSlot);
        // Summary: read serialsim fail
        if (!request.IsSuccess && !request.IsCompleted && string.IsNullOrEmpty(request.SerialNumber))
        {
            logger.LogInformation("[PROCESS OUT CARD] read serial sim fail ...");
            // + 1 error sim seri empty
            order.Value.ErrorSerialNumber.Add("");
            if (dispenser != null)
            {
                dispenser.InventoryQuantity -= 1;
                dispenser.ErrorQuantity += 1;
            }
            return Result.Success();
        }

        // Summary: register fail or move card fail or customer wasnt taken card
        if (!request.IsSuccess && !request.IsCompleted && !string.IsNullOrEmpty(request.SerialNumber))
        {
            logger.LogInformation("[PROCESS OUT CARD] register fail or move card fail/was not taken ...");
            // + 1 error sim seri
            order.Value.ErrorSerialNumber.Add(request.SerialNumber);
            if (dispenser != null)
            {
                dispenser.InventoryQuantity -= 1;
                dispenser.ErrorQuantity += 1;
            }
            return Result.Success();
        }

        var isSim = long.TryParse(request.SerialNumber!, System.Globalization.NumberStyles.None, null, out long serialNumber);
        if (isSim)
        {
            var card = await cardStorageRepository.GetByDeviceIdAndSerialCardAsync(order.Value.DeviceId, serialNumber);
            if (card.HasValue)
            {
                // TODO: xử lí thêm trường hợp đã bán roi thi vang loi
                card.Value.StorageState = StorageStatus.Sold.ToString();
                card.Value.ModifiedOn = DateTime.UtcNow;
            }
        }

        //success
        if (request.IsSuccess && !request.IsCompleted)
        {
            if (dispenser != null)
            {
                dispenser.InventoryQuantity -= 1;
                logger.LogInformation("[PROCESS OUT CARD] tru the ne... ");
            }
            order.Value.SerialNumber.Add(request.SerialNumber!);
            order.Value.StatusOrder = OrderStatus.Failed.ToString();
        }

        //success and completed
        if (request.IsSuccess && request.IsCompleted)
        {
            order.Value.SerialNumber.Add(request.SerialNumber!);
            order.Value.StatusOrder = OrderStatus.Success.ToString();
            order.Value.CompleteOn = DateTime.UtcNow;

            if (dispenser != null)
            {
                dispenser.InventoryQuantity -= 1;
                logger.LogInformation("[PROCESS OUT CARD] tru the xong roi ne!");
            }
        }

        if (dispenser != null && dispenser.ErrorQuantity > 25)
        {
            // check  if error tray is max 
            logger.LogInformation("[PROCESS OUT CARD] qua the trong khay loi roi ne!");

            var errorQuantity = new ErrorQuantity
            {
                DispenserSlot = dispenser.DispenserSlot,
                ItemCode = dispenser.ItemCode,
                Quantity = dispenser.ErrorQuantity,
                ErrorSerialNumbers = []
            };

            var errorTicket = WarehouseTicket.Create(
                TicketType.ErrorTray,
                kiosk.Value.DeviceId,
                string.Empty,
                "System",
                "One or more error trays is nearing limit, please send maintenance to reset error trays.",
                [],
                [errorQuantity]);

            if ((await warehouseTicketRepository.CheckExistsAsync(kiosk.Value.DeviceId, "System", TicketType.ErrorTray)) == false)
            {
                warehouseTicketRepository.Insert(errorTicket);
                bool check = await maintenanceRepository.CheckTicket(kiosk.Value.DeviceId, "Dispenser");
                if (!check)
                {
                    var ticket = Domain.Entities.Maintenance.Create("Dispenser", kiosk.Value.DeviceId,
                        kiosk.Value.KioskName, kiosk.Value.GroupId, LogBy.System.ToString());
                    ticket.Note = DomainErrors.Maintenance.Dispenserer.Message.ToString();
                    maintenanceRepository.Insert(ticket);
                }
            }
        }

        return Result.Success();
    }
}
