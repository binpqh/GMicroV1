using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Group;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Groups.Queries.GetGroupById;

public class GetGroupByIdQueryHandler(
    IGroupRepository groupRepository,
    IUserRepository userRepository,
    IUserIdentifierProvider userIdentifierProvider,
    IKioskRepository kioskRepository)
    : IQueryHandler<GetGroupByIdQuery, Maybe<GroupResponse>>
{
    public async Task<Maybe<GroupResponse>> Handle(GetGroupByIdQuery request, CancellationToken cancellationToken)
    {
        var userGroupId = userIdentifierProvider.GroupId;
        var userRole = userIdentifierProvider.Role;

        if (userRole == null || userRole.Equals("User") && userGroupId == null)
        {
            return Maybe<GroupResponse>.None;
        }
        
        var group = await groupRepository.GetByIdAsync(!string.IsNullOrEmpty(userGroupId) ?  userGroupId : request.Id);
        if (group.HasNoValue) 
        {
            return Maybe<GroupResponse>.None;
        }
        var kioskCount = await kioskRepository.CountInGroupAsync(group.Value.Id.ToString());

        var groupUsers = (await userRepository.GetUsersByGroupIdAsync(request.Id)).Adapt<List<GroupUser>>();
        var response = group.Value.BuildAdapter()
            .AddParameters("UserCount", groupUsers.Count)
            .AddParameters("KioskCount", kioskCount)
            .AddParameters("GroupUsers", groupUsers)
            .AdaptToType<GroupResponse>();
        return response;
    }
}
