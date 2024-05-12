using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.LogKioskSystem;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.AsimLog.Queries.GetLogsByKiosk;

public class GetLogsQuery(string deviceId,int pageSize, int pageNumber,DateTime from, DateTime to) : IQuery<Maybe<PagedList<LogResponse>>>
{
    public string DeviceId { get; set; } = deviceId;
    public int PageSize { get; set; } = pageSize;
    public int PageNumber { get; set; } = pageNumber;
    public DateTime From { get; set; } = from;
    public DateTime To { get; set; } = to.AddDays(1).AddTicks(-1);
}
