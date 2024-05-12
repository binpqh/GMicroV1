using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.Order;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Order.Query.GetAllOrders;

public class GetAllOrdersQuery(int page, int pageSize, string? deviceId, DateTime dateFrom, DateTime dateTo) : IQuery<Maybe<PagedList<OrderResponse>>>
{
    public int PageNumber { get; set; } = page;
    public int PageSize { get; set; } = pageSize;
    public string DeviceId { get; set; } = deviceId ?? string.Empty;
    public DateTime DateFrom { get; set; } = dateFrom;
    public DateTime DateTo { get; set; } = dateTo.AddDays(1).AddTicks(-1);
}
