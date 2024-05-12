using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Payment.Command.PaymentSucceed;

internal class PaymentSucceedCommandHandler(IPaymentRepository paymentRepository) : ICommandHandler<PaymentSucceedCommand, Result>
{
    public async Task<Result> Handle(PaymentSucceedCommand request, CancellationToken cancellationToken)
    {
        var payment = await paymentRepository.GetPaymentByOrderCodeAsync(request.OrderCode);
        if (payment.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject("payment"));
        }

        payment.Value.State = PaymentStatus.Success.ToString();
        payment.Value.FinishedAt = DateTime.UtcNow;
        return Result.Success();
    }
}
