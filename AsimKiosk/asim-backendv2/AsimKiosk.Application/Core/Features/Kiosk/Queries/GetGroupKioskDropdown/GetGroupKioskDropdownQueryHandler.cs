using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Kiosk.Queries.GetGroupKioskDropdown;

public class GetGroupKioskDropdownQueryHandler(IGroupRepository groupRepository, IKioskRepository kioskRepository, IUserIdentifierProvider currentUser) 
    : IQueryHandler<GetGroupKioskDropdownQuery, Maybe<List<GroupKioskDropDownResponse>>>
{
    public async Task<Maybe<List<GroupKioskDropDownResponse>>> Handle(GetGroupKioskDropdownQuery request, CancellationToken cancellationToken)
    {
        var groupKiosks = new List<GroupKioskDropDownResponse>();

        var currentRole = currentUser.Role;
        var currentGroupId = currentUser.GroupId;
        if (currentRole!.Equals("ManagerGroup") && currentGroupId != null)
        {
            var currentGroup = await groupRepository.GetByIdAsync(currentGroupId);
            var currentGroupKiosks = await kioskRepository.GetByGroupIdAsync(currentGroupId);
            var bruh1 = new GroupKioskDropDownResponse
            {
                GroupId = currentGroupId,
                GroupName = currentGroup.Value.GroupName,
                Kiosks = currentGroupKiosks.Adapt<List<GroupKiosk>>()
            };
            groupKiosks.Add(bruh1);
        }
        else 
        {
            var groups = await groupRepository.GetAllAsync();
            var kiosks = await kioskRepository.GetAllAsync();

            foreach (var group in groups.Value.Entities)
            {
                var kiosksInGroup = kiosks.Value.Entities.Where(k => k.GroupId == group.Id.ToString()).Adapt<List<GroupKiosk>>();
                var bruh2 = new GroupKioskDropDownResponse
                {
                    GroupId = group.Id.ToString(),
                    GroupName = group.GroupName,
                    Kiosks = kiosksInGroup
                };
                if (kiosksInGroup.Count > 0)
                {
                    groupKiosks.Add(bruh2);
                }
            }
        }
        return groupKiosks;
    }
}
