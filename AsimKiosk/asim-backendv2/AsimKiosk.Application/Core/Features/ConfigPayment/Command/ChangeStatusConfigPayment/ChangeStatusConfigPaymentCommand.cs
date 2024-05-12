using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.PaymentConfigure;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.ConfigPayment.Command.ChangeStatusConfigPayment
{
    public class ChangeStatusConfigPaymentCommand(ChangeStatusPaymentConfigRequest request) : ICommand<Result>
    {
        public ChangeStatusPaymentConfigRequest ChangeStatusPaymentConfigRequest { get; set; } = request;
    }
}
