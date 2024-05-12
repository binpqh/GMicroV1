using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Maintenance;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Maintenance.Command.UpdateTicketStatus;

public class UpdateTicketCommand(string IdTicket, UpdateMaintenanceRequest request) : ICommand<Result>
{
    public string IdTicket { get; set; } = IdTicket;
    public UpdateMaintenanceRequest UpdateMaintenaceRequest { get; set; } = request;
}
