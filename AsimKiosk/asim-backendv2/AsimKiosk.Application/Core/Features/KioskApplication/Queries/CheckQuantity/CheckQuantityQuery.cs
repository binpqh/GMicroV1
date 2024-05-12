using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk.Inventory;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.KioskApplication.Queries.CheckQuantity;

public class CheckQuantityQuery : IQuery<Maybe<IEnumerable<InventoryKioskResult>>> 
{
    
}