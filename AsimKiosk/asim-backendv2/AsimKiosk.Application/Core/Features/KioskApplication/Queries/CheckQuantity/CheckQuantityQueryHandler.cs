using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk.Inventory;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.KioskApplication.Queries.CheckQuantity;

public class CheckQuantityQueryHandler(
    IKioskRepository kioskRepository,
    IKioskIdentifierProvider kioskIdentifierProvider)
    : IQueryHandler<CheckQuantityQuery, Maybe<IEnumerable<InventoryKioskResult>>>
{
    public async Task<Maybe<IEnumerable<InventoryKioskResult>>> Handle(CheckQuantityQuery request, CancellationToken cancellationToken)
    {
        var kioskId = kioskIdentifierProvider.DeviceId;
        var kiosk = await kioskRepository.GetActiveKioskByAndroidIdAsync(kioskId);
        if (kiosk.HasNoValue)
        {
            return Maybe<IEnumerable<InventoryKioskResult>>.None;
        }

        var inventories = kiosk.Value.Inventories.Select(e =>
        {
            var pCode = "DI" + e.DispenserSlot;
            var peri = kiosk.Value.Peripherals.FirstOrDefault(s => s.Code == pCode);
            return new InventoryKioskResult
            {
                DispenderSlot = e.DispenserSlot,
                PeripheralCode = pCode,
                ItemName = e.ItemCode,
                ItemCode = e.ItemCode,
                ProductCode = e.ProductCode,
                IsActived =
                    e.IsActive && peri?.Status == ActiveStatus.Active.ToString(),
                IsAvailable = e.InventoryQuantity > 5
            };
        }).ToArray();

        return inventories;
    }
}