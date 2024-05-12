using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Inventory.WarehouseTicket;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Inventory.Query.GetNewestTicketId;

public class GetNewestTicketIdQuery(string groupId) : IQuery<Maybe<Domain.Entities.WarehouseTicket>>
{
    public string GroupId { get; set; } = groupId;
}
