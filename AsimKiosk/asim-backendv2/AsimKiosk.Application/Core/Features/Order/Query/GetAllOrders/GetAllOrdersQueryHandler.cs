using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.Order;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Order.Query.GetAllOrders;

internal class GetAllOrdersQueryHandler(/*IOrderRepository orderRepository*/) : IQueryHandler<GetAllOrdersQuery, Maybe<PagedList<OrderResponse>>>
{
    public Task<Maybe<PagedList<OrderResponse>>> Handle(GetAllOrdersQuery request, CancellationToken cancellationToken)
    {
        //string[] deviceIds = { request.DeviceId };
        //var orders = await orderRepository.GetPaginateAsync
        //    (request.PageNumber, request.PageSize, null, deviceIds, null, null, request.DateFrom,request.DateTo,cancellationToken);

        //return new PagedList<OrderResponse>
        //    (
        //        orders.Adapt<List<OrderResponse>>(),
        //        await orderRepository.CountAsync(cancellationToken),
        //        request.PageNumber,request.PageSize
        //    );

        throw new NotImplementedException();
    }
}
