using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.PaymentConfigure;
using AsimKiosk.Domain.Core.Primitives;


namespace AsimKiosk.Application.Core.Features.ConfigPayment.Command.CreateConfigPayment;

public class CreateConfigPaymentCommand(CreatePaymentConfigRequest request) : ICommand<Result>
{
    public CreatePaymentConfigRequest CreatePaymentConfigRequest { get; set; } = request;
}
