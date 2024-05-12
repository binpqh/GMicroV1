using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.User;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;
using MediatR;

namespace AsimKiosk.Application.Core.Features.Users.Queries.GetUserInGroup;

public class GetListUserQueriesHandller(IUserRepository userRepository, IGroupRepository groupRepository) : IQueryHandler<GetListUserQueries, Maybe<List<UserGroupResponse>>>
{
    public async Task<Maybe<List<UserGroupResponse>>> Handle(GetListUserQueries request, CancellationToken cancellationToken)
    {
        var groud = await groupRepository.GetByIdAsync(request.IdGroup);
        if (groud.HasNoValue) return new List<UserGroupResponse>();
        var listUser = await userRepository.GetUsersByGroupIdAsync(request.IdGroup);
        return listUser.Adapt<List<UserGroupResponse>>();
    }
}
