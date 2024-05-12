using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Kiosk.Queries.GetKioskByGroup;

public class GetKiosksByGroupQuery(string groupId, int page, int pageSize)
    : IQuery<Maybe<PagedList<KioskResponse>>>
{
    public string GroupId { get; set; } = groupId;
    public int Page { get; set; } = page;
    public int PageSize { get; set; } = pageSize;
}
