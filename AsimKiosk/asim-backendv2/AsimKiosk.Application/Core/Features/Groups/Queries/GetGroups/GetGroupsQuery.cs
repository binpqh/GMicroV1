using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.Group;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Groups.Queries.GetGroups;

public class GetGroupsQuery(int pageSize, int page) : IQuery<Maybe<PagedList<GroupResponse>>>
{
    public int PageSize { get; set; } = pageSize;
    public int Page { get; set; } = page;
}
