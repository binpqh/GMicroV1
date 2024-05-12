using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Inventory.Query.GetKioskInventories;
public class GetKioskInventoriesQuery : IQuery<Maybe<List<KioskInventoryResponse>>>
{
}
