using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.Group;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Groups.Queries.GetGroups;

public class GetGroupsQueryHandler(
    IUserIdentifierProvider currentUser,
    IGroupRepository groupRepository,
    IKioskRepository kioskRepository,
    IUserRepository userRepository)
    : IQueryHandler<GetGroupsQuery, Maybe<PagedList<GroupResponse>>>
{
    public async Task<Maybe<PagedList<GroupResponse>>> Handle(GetGroupsQuery request, CancellationToken cancellationToken)
    {
        var currentGroupId = currentUser.GroupId;
        if (!string.IsNullOrEmpty(currentGroupId))
        {
            return await GetSingleResponse(request, currentGroupId);
        }

        var groupsTask = groupRepository.GetAllAsync();
        var kiosksTask = kioskRepository.GetAllAsync();
        var usersTask = userRepository.GetAllAsync();

        await Task.WhenAll(groupsTask, kiosksTask, usersTask);

        var groups = groupsTask.Result;
        var kiosks = kiosksTask.Result;
        var users = usersTask.Result;

        var groupKioskCounts = kiosks.Value.Entities.Where(k => !string.IsNullOrEmpty(k.GroupId))
            .GroupBy(kiosk => kiosk.GroupId)
            .ToDictionary(group => group.Key, group => group.Count());

        var groupUserCounts = users.Value.Entities.Where(user => !string.IsNullOrEmpty(user.GroupId))
            .GroupBy(user => user.GroupId)
            .ToDictionary(group => group.Key, group => group.Count());

        var response = groups.Value.Entities
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(group =>
            {
                var kioskCount = groupKioskCounts.GetValueOrDefault(group.Id.ToString(), 0);
                var userCount = groupUserCounts.GetValueOrDefault(group.Id.ToString(), 0);
                return group.BuildAdapter()
                            .AddParameters("KioskCount", kioskCount)
                            .AddParameters("GroupUsers", new List<GroupUser>())
                            .AddParameters("UserCount", userCount)
                            .AdaptToType<GroupResponse>();
            }).ToList();


        return new PagedList<GroupResponse>(response, response.Count, request.Page, request.PageSize);
    }

    private async Task<Maybe<PagedList<GroupResponse>>> GetSingleResponse(GetGroupsQuery request, string currentGroupId)
    {
        var currentGroup = await groupRepository.GetByIdAsync(currentGroupId);
        if (currentGroup.HasNoValue)
        {
            return Maybe<PagedList<GroupResponse>>.None;
        }
        var currentGroupKiosks = await kioskRepository.GetByGroupIdAsync(currentGroupId);
        var currentGroupUsers = await userRepository.GetUsersByGroupIdAsync(currentGroupId);
        var innerResponse = currentGroup.Value.BuildAdapter()
            .AddParameters("KioskCount", currentGroupKiosks.Count)
            .AddParameters("GroupUsers", new List<GroupUser>())
            .AddParameters("UserCount", currentGroupUsers.Count)
            .AdaptToType<GroupResponse>();
        var singleResponse = new List<GroupResponse>
            {
                innerResponse
            };
        return new PagedList<GroupResponse>(singleResponse, 1, request.Page, request.PageSize);
    }

}
