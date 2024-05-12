using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Inventory.Command.DeleteTicket;

public class DeleteTicketCommand(string ticketId) : ICommand<Result>
{
    public string TicketId { get; set; } = ticketId;
}
