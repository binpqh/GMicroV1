using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Features.KioskApplication.Command.OrderByOrderCode;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace AsimKiosk.Application.Core.Features.KioskApplication.Command.OrderByDeviceIdAndOrderCode;

internal class OrderByOrderCodeCommandHandler(
    IGroupRepository groupRepository,
    IOrderRepository orderRepository,
    IKioskRepository kioskRepository,
    IProductRepository productRepository,
    IMaintenanceRepository maintenanceRepository,
    IKioskIdentifierProvider kioskIdentifierProvider,
    ILogger<OrderByOrderCodeCommandHandler> logger)
    : ICommandHandler<OrderByOrderCodeCommand, Result>
{
    public async Task<Result> Handle(OrderByOrderCodeCommand request, CancellationToken cancellationToken)
    {
        var kiosk = await kioskRepository.GetActiveKioskByAndroidIdAsync(kioskIdentifierProvider.DeviceId);

        var order = await orderRepository.GetOrderByOrderCodeAsync(request.OrderCode);

        if (kiosk.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Kiosk));
        }

        var productItem = await productRepository.GetItemByCodeAsync(request.ItemCode);
        if (productItem.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Item));
        }
        if (order.HasValue && order.Value.Status == ActiveStatus.Active.ToString())
        {
            return Result.Failure(DomainErrors.Order.Ordering);
        }

        var group = await groupRepository.GetByIdAsync(kiosk.Value.GroupId);
        if (group.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Group));
        }
        //TODO Get Item in group's product which kiosk participate

        // bool isEnoughToPurchase = await CheckInventory(kiosk.Value,kioskIdentifierProvider.DeviceId, request.ItemCode, request.Quantity);

        // if (!isEnoughToPurchase)
        // {
        //     var maintance = Domain.Entities.Maintenance.Create("InventoriesNotEnough", kiosk.Value.KioskName,kiosk.Value.Id.ToString(),kiosk.Value.GroupId);

        //     maintenanceRepository.Insert(maintance);

        //     return Result.Failure(DomainErrors.Order.InventoryNotEnough);
        // }
        var createOrder =
            new Domain.Entities.Order
            {
                DeviceId = kioskIdentifierProvider.DeviceId,
                KioskName = kiosk.Value.KioskName,
                GroupName = group.Value.GroupName,
                ItemCode = request.ItemCode,
                OrderCode = request.OrderCode,
                Quantity = request.Quantity,
                TotalMountVND = productItem.Value.Price * request.Quantity,
            };

        orderRepository.Insert(createOrder);

        return Result.Success();
    }
    private async Task<bool> CheckInventory(Domain.Entities.Kiosk kiosk, string deviceId, string itemCode, int quantityRequire)
    {
        var inventory = await kioskRepository.GetInventoriesKioskItemProductAsync(deviceId, itemCode);

        var totalQuantity = inventory.Sum(x => x.InventoryQuantity);
        logger.LogInformation("So luong the :" + totalQuantity);
        logger.LogInformation("So luong the yeu cau :" + quantityRequire);
        if (totalQuantity > 5 && totalQuantity >= quantityRequire)
        {
            return true;
        }
        else
        {
            string slotsError = string.Join(", ", inventory.Select(i => i.DispenserSlot));

            maintenanceRepository.Insert(new Domain.Entities.Maintenance
            {
                DeviceId = deviceId,
                KioskName = kiosk.KioskName,
                Note = "Invalid slot dispenser :" + slotsError,
            });
        }

        return false;
    }
}
