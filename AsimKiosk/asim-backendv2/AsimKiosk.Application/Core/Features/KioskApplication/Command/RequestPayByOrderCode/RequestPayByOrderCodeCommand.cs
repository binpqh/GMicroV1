using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Payment;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.KioskApplication.Command.RequestPayByOrderCode;

public class RequestPayByOrderCodeCommand(PaymentRequest req) : ICommand<Result<RequestPaymentResponse>>
{
    public PaymentRequest Request { get; set; } = req;
}
