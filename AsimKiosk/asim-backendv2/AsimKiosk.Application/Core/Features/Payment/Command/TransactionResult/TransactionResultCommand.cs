using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Payment.Hub;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Payment.Command.TransactionResult
{
    public class TransactionResultCommand(IpnRequest request) : ICommand<Result>
    {
        public string OrderNo { get; set; } = request.OrderNo ?? string.Empty;
        public string TransNo { get; set; } = request.TransNo ?? string.Empty;
        public int PaymentStatus { get; set; } = request.PaymentStatus;
        public string TokenInfo { get; set; } = request.TokenInfo ?? string.Empty;
    }
}
