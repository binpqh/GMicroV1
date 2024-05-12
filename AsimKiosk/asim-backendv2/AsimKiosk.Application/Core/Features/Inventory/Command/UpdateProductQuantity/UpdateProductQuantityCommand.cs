using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Inventory.WarehouseTicket;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Inventory.Command.UpdateProductQuantity;

public class UpdateProductQuantityCommand(string ticketId, int slot, UpdateProductQuantityRequest request) : ICommand<Result>
{
    public string TicketId { get; set; } = ticketId;

    public int Slot { get; set; } = slot;

    public UpdateProductQuantityRequest Request { get; set; } = request;
}
