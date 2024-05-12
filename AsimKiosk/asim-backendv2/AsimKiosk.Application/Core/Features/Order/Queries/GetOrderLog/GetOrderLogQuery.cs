using System.Runtime.Intrinsics.X86;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Order;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Order.Queries.GetOrderLog;

public class GetOrderLogQuery(string orderId) : IQuery<Maybe<OrderLogResponse[]>>
{
    public string OrderId { get; set; } = orderId;
}
