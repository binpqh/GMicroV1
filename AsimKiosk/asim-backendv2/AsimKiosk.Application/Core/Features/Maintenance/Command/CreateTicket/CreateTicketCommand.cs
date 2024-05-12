using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Maintenance;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Maintenance.Command.CreateTicket;
public class CreateTicketCommand(MantenanceRequestHuman ticketRequest) : ICommand<Result>
{
    public MantenanceRequestHuman Request = ticketRequest;
}
 