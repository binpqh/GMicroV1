using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Order;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Order.Query.GetOrderByOrderCode;

public class GetOrderByOrderCodeQuery(string orderCode) : IQuery<Maybe<OrderDetailResponse>>
{
    public string OrderCode { get; set; } = orderCode;
}
