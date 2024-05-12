using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Payment.Command.TransactionResult;

public class TransactionResultCommandHandler(
    IKioskHub kioskHub,
    IPaymentRepository paymentRepository,
    IOrderRepository orderRepository)
    : ICommandHandler<TransactionResultCommand, Result>
{
    public async Task<Result> Handle(TransactionResultCommand request, CancellationToken cancellationToken)
    {
        var isSuccessPay = true;
        var payment = await paymentRepository.GetPaymentByOrderCodeAsync(request.OrderNo);
        if (payment.HasNoValue)
        {
            return Result.Failure(DomainErrors.Payment.NotFoundWithOrderId(request.OrderNo));
        }
        var order = await orderRepository.GetOrderByOrderCodeAsync(payment.Value.OrderCode);
        if (request.PaymentStatus != 0) // SuccessCode : 0 => success
        {
            isSuccessPay = false;
            payment.Value.State = Domain.Enums.PaymentStatus.Failed.ToString();
            await kioskHub.NotifyResultTransaction(order.Value.DeviceId, order.Value.OrderCode,payment.Value.TransactionNumber, isSuccessPay);
            return Result.Failure(DomainErrors.Payment.FailTransactionFromPaymentHub(request.TransNo));
        }
        payment.Value.State = Domain.Enums.PaymentStatus.Success.ToString();
        payment.Value.TokenInformation = request.TokenInfo;
        order.Value.PaymentStatus = Domain.Enums.PaymentStatus.Success.ToString();
        order.Value.PaymentMethod = payment.Value.BankCode != null ? $"{payment.Value.BankCode}" : "POS";
        await kioskHub.NotifyResultTransaction(order.Value.DeviceId, order.Value.OrderCode,payment.Value.TransactionNumber, isSuccessPay);
        return Result.Success();
    }
}