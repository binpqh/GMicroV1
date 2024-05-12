using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Maintenance.Command.DeleteTicket;

public class DeleteTicketCommand(string idTicket) : ICommand<Result>
{
    public string Id { get; set; } = idTicket;
}
