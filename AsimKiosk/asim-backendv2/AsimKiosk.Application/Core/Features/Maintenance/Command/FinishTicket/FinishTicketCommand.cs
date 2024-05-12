using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Maintenance.Command.FinishTicket;

public class FinishTicketCommand(string idTicket) : ICommand<Result>
{
    public string IdTicket { get; set; } = idTicket;
}
