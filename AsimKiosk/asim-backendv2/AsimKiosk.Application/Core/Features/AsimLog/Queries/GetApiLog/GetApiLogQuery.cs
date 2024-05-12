using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.LogAPI;
using AsimKiosk.Contracts.Order;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.AsimLog.Queries.GetApiLog;

public class GetApiLogQuery(string deviceId, DateTime from, DateTime to, int page, int pageSize) : IQuery<Maybe<PagedList<LogApiResponse>>>
{
    public string DeviceId { get; set; } = deviceId;
    public DateTime From { get; set; } = from;
    public DateTime To { get; set; } = to;
    public int Page { get; set; } = page;
    public int PageSize { get; set; } = pageSize;
}
