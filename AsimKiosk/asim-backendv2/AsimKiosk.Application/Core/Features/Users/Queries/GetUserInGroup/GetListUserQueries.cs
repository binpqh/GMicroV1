using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.User;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Users.Queries.GetUserInGroup;

public class GetListUserQueries(string idGroud) : IQuery<Maybe<List<UserGroupResponse>>>
{
    public string IdGroup { get; set; } = idGroud;
}

