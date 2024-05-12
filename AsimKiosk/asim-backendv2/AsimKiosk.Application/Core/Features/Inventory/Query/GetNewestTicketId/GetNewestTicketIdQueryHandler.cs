using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Inventory.Query.GetNewestTicketId;

public class GetNewestTicketIdQueryHandler(IWarehouseTicketRepository warehouseTicketRepository) : IQueryHandler<GetNewestTicketIdQuery, Maybe<Domain.Entities.WarehouseTicket>>
{
    public async Task<Maybe<Domain.Entities.WarehouseTicket>> Handle(GetNewestTicketIdQuery request, CancellationToken cancellationToken)
    {
        return await warehouseTicketRepository.GetNewestTicketId(request.GroupId);
    }
}
