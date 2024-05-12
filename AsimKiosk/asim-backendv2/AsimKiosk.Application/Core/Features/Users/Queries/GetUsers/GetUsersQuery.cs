using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.User;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Users.Queries.GetUsers;

public class GetUsersQuery(int pageSize, int page) : IQuery<Maybe<PagedList<UserResponse>>>
{
    public int PageSize { get; set; } = pageSize;
    public int Page { get; set; } = page;
}
