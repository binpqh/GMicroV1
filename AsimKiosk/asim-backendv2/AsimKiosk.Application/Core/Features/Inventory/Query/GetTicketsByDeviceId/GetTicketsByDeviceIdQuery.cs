using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.Inventory.WarehouseTicket;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Inventory.Query.GetTicketsByDeviceId;

public class GetTicketsByDeviceIdQuery(string deviceId, int page, int pageSize) : IQuery<Maybe<PagedList<WarehouseTicketResponse>>>
{
    public string DeviceId { get; set; } = deviceId;
    public int Page { get; set; } = page;
    public int PageSize { get; set; } = pageSize;
    
}
