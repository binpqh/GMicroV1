
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Maintenance;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Maintenance.Queries.GetTicketById;

public class GetTickecByIdQueryHandler(IMaintenanceRepository maintenanceRepository): IQueryHandler<GetTicketByIdQuery, Maybe<MaintenanceResponse>>
{
    public async Task<Maybe<MaintenanceResponse>> Handle(GetTicketByIdQuery request, CancellationToken cancellationToken)
    {
        var ticket = await maintenanceRepository.GetByIdAsync(request.Idticket);
        if (ticket.HasNoValue)
        {
            return Maybe<MaintenanceResponse>.None;
        }
        var response = ticket.Value.Adapt<MaintenanceResponse>();
        return response;
    }
}
