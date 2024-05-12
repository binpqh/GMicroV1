using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Maintenance;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Maintenance.Queries.GetTicketById;

public class GetTicketByIdQuery(string idTicket): IQuery<Maybe<MaintenanceResponse>>
{
    public string Idticket { get; set; } = idTicket;
}
