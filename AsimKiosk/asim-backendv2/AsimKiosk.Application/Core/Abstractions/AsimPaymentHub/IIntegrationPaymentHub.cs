using AsimKiosk.Contracts.Payment;
using AsimKiosk.Contracts.Payment.Hub;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.ValueObject;

namespace AsimKiosk.Application.Core.Abstractions.AsimPaymentHub;
public interface IIntegrationPaymentHub
{
    Task<List<PaymentMethod>> FetchPaymentMethodAsync(CancellationToken cancellationToken);
    Task<Result<RequestPayResponse>> RequestPayAsync(PayRequest req,
        CancellationToken cancellationToken);
    Task<Result<TransactionResponse>> CheckResultAsync(CheckPayRequest checkPay, CancellationToken cancellationToken);
}