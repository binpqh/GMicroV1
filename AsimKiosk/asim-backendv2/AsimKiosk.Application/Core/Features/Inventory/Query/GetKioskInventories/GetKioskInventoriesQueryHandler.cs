using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Features.Kiosk.Queries.GetKiosksDropdown;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Inventory.Query.GetKioskInventories;

public class GetKioskInventoriesQueryHandler(
        IKioskRepository kioskRepository,
        IGroupRepository groupRepository,
        IUserIdentifierProvider currentUser
    )
    : IQueryHandler<GetKioskInventoriesQuery, Maybe<List<KioskInventoryResponse>>>
{
    public async Task<Maybe<List<KioskInventoryResponse>>> Handle(GetKioskInventoriesQuery request, CancellationToken cancellationToken)
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
        var response = results.Select(k =>
            {
                var dispensers = k.Inventories.Where(i => !string.IsNullOrEmpty(i.ItemCode)).Adapt<List<InventoryItem>>();
                foreach (var dispenser in dispensers)
                {
                    var pCode = "DI" + dispenser.DispenserSlot;
                    var peripheral = k.Peripherals.FirstOrDefault(p => p.Code == pCode);
                    dispenser.Id = peripheral != null ? peripheral.Id : string.Empty;
                }
                var groupName = groups.GetValueOrDefault(k.GroupId ?? "", "No Group");
                return k.BuildAdapter().AddParameters("Dispenser", dispensers).AddParameters("GroupName", groupName).AdaptToType<KioskInventoryResponse>();
            }
            ).ToList();
        return response;
    }
}
