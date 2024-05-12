using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.PaymentConfigure;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.ConfigPayment.Queries.GetPaymentConfigs;

public class GetPaymentConfigsQueryHandler(
    IPaymentConfigRepository paymentConfigRepository)
    : IQueryHandler<GetPaymentConfigsQuery, Maybe<List<PaymentConfigResponse>>>
{
    public async Task<Maybe<List<PaymentConfigResponse>>> Handle(GetPaymentConfigsQuery request, CancellationToken cancellationToken)
    {
        var configPayments = await paymentConfigRepository.GetAllAsync();
        var res = configPayments.Value.Entities.Where(pc => pc.Status.ToString() != ActiveStatus.Deleted.ToString()).ToList();
        if (res.Count == 0)
        {
            return Maybe<List<PaymentConfigResponse>>.None;
        }
        var response = res
           .Adapt<List<PaymentConfigResponse>>();
        return response;
    }
}
