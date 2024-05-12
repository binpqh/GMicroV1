using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Group;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Groups.Queries.GetGroupDropdown;

public class GetGroupDropdownQuery : IQuery<Maybe<List<GroupDropdownResponse>>>
{
}
