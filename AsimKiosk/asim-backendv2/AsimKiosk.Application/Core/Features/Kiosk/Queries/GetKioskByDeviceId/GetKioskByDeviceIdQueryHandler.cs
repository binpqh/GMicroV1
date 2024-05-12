using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Kiosk.Queries.GetKioskByDeviceId;

public class GetKioskByDeviceIdQueryHandler(
    IKioskRepository kioskRepository,
    IUserIdentifierProvider userIdentifierProvider,
    IGroupRepository groupRepository)
    : IQueryHandler<GetKioskByDeviceIdQuery, Maybe<KioskGeneralDetails>>
{
    public async Task<Maybe<KioskGeneralDetails>> Handle(GetKioskByDeviceIdQuery request, CancellationToken cancellationToken)
    {
        var kiosk = await kioskRepository.GetKioskAndroidIdAsync(request.DeviceId);

        if (kiosk.HasNoValue)
        {
            return Maybe<KioskGeneralDetails>.None;
        }

        var kioskGroup = await groupRepository.GetByIdAsync(kiosk.Value.GroupId);

        string groupName = "No Group";

        if (kioskGroup.HasValue)
        {
            groupName = kioskGroup.Value.GroupName;
        }

        var externalDevices = kiosk.Value.Peripherals.Adapt<List<ExternalDevice>>().Select(e =>
        {
            e.DispenserSlot = e.Code.ToUpper().StartsWith("DI") && int.TryParse(e.Code.Substring(2), out var dispenserSlot) ? dispenserSlot : 0;
            e.HasSerialNumbers = kiosk.Value.Inventories.FirstOrDefault(r => r.DispenserSlot == e.DispenserSlot, new()).HasSerialNumbers;
            e.ProductCode = kiosk.Value.Inventories.FirstOrDefault(r => r.DispenserSlot == e.DispenserSlot, new()).ProductCode;
            e.ItemCode = kiosk.Value.Inventories.FirstOrDefault(r => r.DispenserSlot == e.DispenserSlot, new()).ItemCode;

            return e;
        }).ToArray();

        if (kiosk.Value.GroupId != userIdentifierProvider.GroupId
            && !(new[] { UserRole.Administrator.ToString(), UserRole.Superman.ToString() }.Contains(userIdentifierProvider.Role)))
        {
            return Maybe<KioskGeneralDetails>.None;
        }

        var response = kiosk.Value.BuildAdapter().AddParameters("GroupName", groupName).AddParameters("ExternalDevices", externalDevices).AdaptToType<KioskGeneralDetails>();

        return response;
    }
}
