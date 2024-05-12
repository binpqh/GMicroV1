using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Kiosk.Queries.GetGroupKioskDropdown;

public class GetGroupKioskDropdownQuery : IQuery<Maybe<List<GroupKioskDropDownResponse>>>
{
}
