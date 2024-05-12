using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Order;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
namespace AsimKiosk.Application.Core.Features.Order.Queries.GetOrderLog;

public class GetOrderLogQueryHandler(
    IOrderRepository orderRepository)
    : IQueryHandler<GetOrderLogQuery, Maybe<OrderLogResponse[]>>
{
    public async Task<Maybe<OrderLogResponse[]>> Handle(GetOrderLogQuery request, CancellationToken cancellationToken)
    {
        var kiosk = await orderRepository.GetOrderByOrderCodeAsync(request.OrderId);

        if (kiosk.HasNoValue)
        {
            return Maybe<OrderLogResponse[]>.None;
        }
        return kiosk.Value.LogProcessOrder.Select(e => new OrderLogResponse
        {
            CreateAt = e.CreatedAt,
            Message = e.Message
        }).OrderByDescending(e => e.CreateAt).ToArray();
    }
}
