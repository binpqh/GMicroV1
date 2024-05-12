using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.ValueObject;

namespace AsimKiosk.Domain.Repositories
{
    public interface IPaymentMethodRepository
    {
        Task<List<PaymentMethod>> GetPaymentMethodsAsync(CancellationToken cancellationToken);
        Task<Maybe<string>> GetPartnerCodeByBankCodeAsync(string bankCode, CancellationToken cancellationToken);
        Task<Maybe<string>> GetPartnerCodeByProductCodeAsync(string productCode, CancellationToken cancellationToken);
    }
}