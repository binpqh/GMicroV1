using AsimKiosk.Application.Core.Abstractions.AsimPaymentHub;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using AsimKiosk.Domain.ValueObject;

namespace AsimKiosk.Infrastructure.Persistence.Repositories;

internal class PaymentMethodRepository(IIntegrationPaymentHub integrationPaymentHub) : IPaymentMethodRepository
{
    public async Task<List<PaymentMethod>> GetPaymentMethodsAsync(CancellationToken cancellationToken)
        => await integrationPaymentHub.FetchPaymentMethodAsync(cancellationToken);

    public async Task<Maybe<string>> GetPartnerCodeByProductCodeAsync(string productCode, CancellationToken cancellationToken)
    {
        var paymentMethods = await integrationPaymentHub.FetchPaymentMethodAsync(cancellationToken);
        var res = paymentMethods.Where(pm => pm.PaymentProducts
                                        .Any(pp => pp.ProductCode == productCode))
                                    .Select(pm => pm.PartnerCode)
                                    .FirstOrDefault();
        return res is null ? Maybe<string>.None :
            Maybe<string>.From(res);
    }
    public async Task<Maybe<string>> GetPartnerCodeByBankCodeAsync(string bankCode, CancellationToken cancellationToken)
    {
        var paymentMethods = await integrationPaymentHub.FetchPaymentMethodAsync(cancellationToken);
        var res = paymentMethods.Where(pm => pm.PaymentProducts
                                        .Any(pp => pp.PaymentBankCodes.Any(pbc => pbc.BankCode == bankCode)))
                                    .Select(pm => pm.PartnerCode)
                                    .FirstOrDefault();
        return res is null ? Maybe<string>.None :
            Maybe<string>.From(res);
    }
}
