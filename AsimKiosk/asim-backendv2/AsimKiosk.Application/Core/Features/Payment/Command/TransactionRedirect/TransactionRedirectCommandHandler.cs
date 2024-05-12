using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace AsimKiosk.Application.Core.Features.Payment.Command.TransactionRedirect
{
    internal class TransactionRedirectCommandHandler(
        IPaymentRepository paymentRepository,
        IOrderRepository orderRepository,
        IKioskHub kioskHub,
        ILogger<TransactionRedirectCommandHandler> logger)
        : ICommandHandler<TransactionRedirectCommand, Result>
    {
        private readonly ILogger _logger = logger;

        public async Task<Result> Handle(TransactionRedirectCommand request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Đã call vào đc gòi nè");
            var isSuccessPay = true;
            var payment = await paymentRepository.GetPaymentByTransactionNumberAsync(request.OrderId);
            
            if (payment.HasNoValue)
            {
               
                return Result.Failure(DomainErrors.Payment.NotFoundWithOrderId(request.OrderId));
            }
            var order = await orderRepository.GetOrderByOrderCodeAsync(payment.Value.OrderCode);
            if (request.Message != "Success") // SuccessCode : 0 => success
            {
                isSuccessPay = false;
                await kioskHub.NotifyResultTransaction(order.Value.DeviceId, order.Value.OrderCode, payment.Value.TransactionNumber, isSuccessPay);
                return Result.Failure(DomainErrors.Payment.FailTransactionFromPaymentHub(request.TransactionTs));
            }
            payment.Value.State = Domain.Enums.PaymentStatus.Success.ToString();
            await kioskHub.NotifyResultTransaction(order.Value.DeviceId, order.Value.OrderCode, payment.Value.TransactionNumber, isSuccessPay);
            return Result.Success();
        }
    }
}
