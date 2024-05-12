using AsimKiosk.Application.Core.Abstractions.AsimPackageSim;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.KioskApplication.Command.RegisterPackageSim;

public class RegisterPackageSimCommandHandler(
    IPackageSim packageSim,
    IPaymentRepository paymentRepository,
    IOrderRepository orderRepository,
    ICardStorageRepository cardStorageRepository,
    IKioskRepository kioskRepository)
    : ICommandHandler<RegisterPackageSimCommand, Result>
{

    public async Task<Result> Handle(RegisterPackageSimCommand request, CancellationToken cancellationToken)
    {
        var payment = await paymentRepository.GetPaymentByOrderCodeAsync(request.OrderCode);
        if ((payment.HasValue && payment.Value.State != PaymentStatus.Success.ToString()) || payment.HasNoValue)
        {
            return Result.Failure(DomainErrors.Payment.IsNotCompletedYet);
        }

        var order = await orderRepository.GetOrderByOrderCodeAsync(request.OrderCode);
        if (order.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Order));
        }
        // return Result.Success();
        var kiosk = await kioskRepository.GetActiveKioskByAndroidIdAsync(order.Value.DeviceId);
        var cardStored = await cardStorageRepository.GetByDeviceIdAndSerialCardAsync(order.Value.DeviceId, long.Parse(request.SerialSim));
        if (cardStored.HasNoValue) return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Card));
        if (cardStored.HasValue && cardStored.Value.StorageState == StorageStatus.Registered.ToString())
        {
            return Result.Success();
        }
        if (await packageSim.Register(request.SerialSim, order.Value.ItemCode, payment.Value.TransactionNumber, kiosk.Value.StoreCode))
        {
            cardStored.Value.StorageState = StorageStatus.Registered.ToString();
            return Result.Success();
        }
        else
        {
            cardStored.Value.StorageState = StorageStatus.Error.ToString();
            return Result.Failure(DomainErrors.Product.RegisterSimFailed);
        }
    }
}
