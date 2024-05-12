using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Inventory.Command.AddQuantityIntoDispenser;

public class AddQuantityIntoDispenserCommand(string? deviceId, string? itemCode, int quantity, int slotDispenser)
    : ICommand<Result>
{
    public string DeviceId { get; set; } = deviceId ?? string.Empty;
    public string ItemCode { get; set; } = itemCode ?? string.Empty;
    public int Quantity { get; set; } = quantity;
    public int SlotDispenser { get; set; } = slotDispenser;
}
