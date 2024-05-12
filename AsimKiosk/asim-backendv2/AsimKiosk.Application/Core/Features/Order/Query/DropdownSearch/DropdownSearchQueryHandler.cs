using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Order;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Order.Query.DropdownSearch;

public class DropdownSearchQueryHandler(IOrderRepository orderRepository) : IQueryHandler<DropdownSearchQuery, Maybe<List<OrderDropdownResponse>>>
{
    public async Task<Maybe<List<OrderDropdownResponse>>> Handle(DropdownSearchQuery request, CancellationToken cancellationToken)
    {
        var results = await Task.Run(() => orderRepository.DropdownSearch(request.QueryString, request.Number));
        return results.Adapt<List<OrderDropdownResponse>>();
    }
}
