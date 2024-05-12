using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Group;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Groups.Queries.GetGroupDropdown;

public class GetGroupDropdownQueryHandler(IGroupRepository groupRepository)
    : IQueryHandler<GetGroupDropdownQuery, Maybe<List<GroupDropdownResponse>>>
{
    public async Task<Maybe<List<GroupDropdownResponse>>> Handle(GetGroupDropdownQuery request, CancellationToken cancellationToken)
    {
        var groups = await groupRepository.GetAllAsync();
        if (groups.HasNoValue)
        {
            return Maybe<List<GroupDropdownResponse>>.None;
        }
        var response = groups.Value.Entities.Adapt<List<GroupDropdownResponse>>();
        return response;
    }
}
