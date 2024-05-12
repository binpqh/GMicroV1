using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.PaymentConfigure;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.ConfigPayment.Command.UpdateConfigPayment;

public class UpdateConfigPaymentCommand(UpdatePaymentConfigRequest request) : ICommand<Result>
{
    public UpdatePaymentConfigRequest UpdatePaymentConfigRequest { get; set; } = request;
}
