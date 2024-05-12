using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.User;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using Mapster;


namespace AsimKiosk.Application.Core.Features.Users.Queries.GetUsers;

public class GetUsersQueryHandler(
    IUserIdentifierProvider userIdentifier,
    IUserRepository userRepository,
    IGroupRepository groupRepository)
    : IQueryHandler<GetUsersQuery, Maybe<PagedList<UserResponse>>>
{
    public async Task<Maybe<PagedList<UserResponse>>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var userGroup = userIdentifier.GroupId;
        var users = await userRepository.GetAllAsync();
        var groupList = await groupRepository.GetAllAsync();
        var groupNameDictionary = groupList.Value.Entities.ToDictionary(k => k.Id.ToString(), v => v.GroupName);
        var totalUsers = users.Value.Entities
            .Where(u => u.Status != ActiveStatus.Deleted.ToString() && u.Role != UserRole.Superman.ToString())
            .Select(user =>
            {
                string groupName = "Administration Group";
                if (user.Role == "ManagerGroup" || user.Role == "User")
                {
                    groupName = groupNameDictionary.GetValueOrDefault(user.GroupId, "No Group");
                }
                return user.BuildAdapter().AddParameters("GroupName", groupName).AdaptToType<UserResponse>();
            })
            .ToList();

        var response = totalUsers.Skip((request.Page - 1) * request.PageSize).Take(request.PageSize);

        return new PagedList<UserResponse>(response, totalUsers.Count, request.Page, request.PageSize);
    }
}