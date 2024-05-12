using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.User;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Users.Queries.GetUsersNoGroup;

public class GetUsersNoGroupQuery(int page, int pageSize) : IQuery<Maybe<PagedList<UserResponse>>>
{
    public int Page { get; set; } = page;
    public int PageSize { get; set; } = pageSize;
}
