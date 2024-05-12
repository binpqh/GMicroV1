using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Payment.Command.PaymentSucceed;

public class PaymentSucceedCommand(string orderCode) : ICommand<Result>
{
    public string OrderCode { get; set; } = orderCode;
}
