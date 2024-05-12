using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.PaymentConfigure;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.ConfigPayment.Queries.GetPaymentConfigs;

public class GetPaymentConfigsQuery : IQuery<Maybe<List<PaymentConfigResponse>>>
{
}
