using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Inventory.WarehouseTicket;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Inventory.Command.ClearErrorTray;

public class ClearErrorTrayCommand(string ticketId, int[] slots, ChangeTicketDispenserStatusRequest request) : ICommand<Result>
{
    public string TicketId{ get; set; } = ticketId;
    public int[] Slots { get; set; } = slots;
    public ChangeTicketDispenserStatusRequest Request { get; set; } = request;
}
