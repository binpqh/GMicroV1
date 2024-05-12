using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Inventory.WarehouseTicket;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Inventory.Query.GetTicket;

public class GetTicketQuery(string id) : IQuery<Maybe<WarehouseTicketDetails>>
{
    public string Id { get; set; } = id;
}
