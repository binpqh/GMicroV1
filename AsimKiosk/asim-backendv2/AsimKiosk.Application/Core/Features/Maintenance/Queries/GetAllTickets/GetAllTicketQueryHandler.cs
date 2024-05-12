using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.Maintenance;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Maintenance.Queries.GetAllTickets;

public class GetAllTickecQueryHandler(IMaintenanceRepository maintenanceRepository, IUserIdentifierProvider userIdentifierProvider): IQueryHandler<GetAllTicketQuery, Maybe<PagedList<MaintenanceResponse>>>
{
    public async Task<Maybe<PagedList<MaintenanceResponse>>> Handle(GetAllTicketQuery request, CancellationToken cancellationToken)
    {
        if(userIdentifierProvider.Role == UserRole.Administrator.ToString() || userIdentifierProvider.Role == UserRole.Superman.ToString())
        {
            var tickets = await maintenanceRepository.GetAllAsyncIsNotDelete();

            if (!tickets.Value.Any()) return Maybe<PagedList<MaintenanceResponse>>.None;

            var totalCunt = tickets.Value.Count;

            var response = tickets.Value
                            .Skip((request.Page - 1) * request.PageSize)
                            .Take(request.PageSize)
                            .Adapt<List<MaintenanceResponse>>();

            return new PagedList<MaintenanceResponse>(response, totalCunt, request.Page, request.PageSize);
        }
        else
        {
            var tickets = await maintenanceRepository.GetByGroupIdAsync(userIdentifierProvider.GroupId!);

            if(!tickets.Value.Any()) return Maybe<PagedList<MaintenanceResponse>>.None;

            var totalCunt = tickets.Value.Count;
            var response = tickets.Value
                            .Skip((request.Page - 1) * request.PageSize)
                            .Take(request.PageSize)
                            .Adapt<List<MaintenanceResponse>>();

            return new PagedList<MaintenanceResponse>(response, totalCunt, request.Page, request.PageSize);
        }
    }
}