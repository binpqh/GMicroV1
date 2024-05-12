using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Kiosk.Queries.GetKiosksDropdown;

public class GetKiosksDropdownQueryHandler(
        IKioskRepository kioskRepository, 
        IGroupRepository groupRepository,
        IUserIdentifierProvider currentUser
    ) 
    : IQueryHandler<GetKiosksDropdownQuery, Maybe<List<KioskDropdownResponse>>>
{
    public async Task<Maybe<List<KioskDropdownResponse>>> Handle(GetKiosksDropdownQuery request, CancellationToken cancellationToken)
    {
        var kiosks = await kioskRepository.GetAllAsync();
        var groups = (await groupRepository.GetAllAsync()).Value.Entities.ToDictionary(g => g.Id.ToString(), v => v.GroupName);

        var query = kiosks.Value.Entities.Where(k => !string.IsNullOrEmpty(k.GroupId)).AsQueryable();

        var role = currentUser.Role;
        var currentGroup = currentUser.GroupId;

        if ((role!.Equals("User") || role.Equals("ManagerGroup")) && !string.IsNullOrEmpty(currentGroup))
        {
            query = query.Where(k => k.GroupId == currentGroup);
        }

        var results = query.ToList();

        var response = results
            .Select(k =>
               {
                   var groupName = groups.GetValueOrDefault(k.GroupId ?? "", "No Group");
                   return k.BuildAdapter().AddParameters("GroupName", groupName).AdaptToType<KioskDropdownResponse>();
               }
            ).ToList();

        return response;
    }
}
