using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.AsimLog.Queries.GetKioskLogs;

public class GetKioskLogsQuery(int pageSize, int pageNumber) : IQuery<Maybe<PagedList<KioskLogResponse>>>
{
    public int PageSize { get; set; } = pageSize;
    public int PageNumber { get; set; } = pageNumber;
}
