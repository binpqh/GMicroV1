using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Features.Inventory.Query.GetTicketsByDeviceId;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.Inventory.WarehouseTicket;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Inventory.Query.GetTicketByDeviceId;

public class GetTicketsByDeviceIdQueryHandler(
        IKioskRepository kioskRepository,
        IGroupRepository groupRepository,
        IUserRepository userRepository,
        IWarehouseTicketRepository warehouseTicket,
        IUserIdentifierProvider userIdentifier
)
    : IQueryHandler<GetTicketsByDeviceIdQuery, Maybe<PagedList<WarehouseTicketResponse>>>
{
    public async Task<Maybe<PagedList<WarehouseTicketResponse>>> Handle(GetTicketsByDeviceIdQuery request, CancellationToken cancellationToken)
    {
        var kiosk = await kioskRepository.GetKioskAndroidIdAsync(request.DeviceId);
        if (kiosk.HasNoValue)
        {
            return Maybe<PagedList<WarehouseTicketResponse>>.None;
        }

        var tickets = await warehouseTicket.GetTicketsByDeviceId(request.DeviceId);
        if (!tickets.Any())
        {
            return new PagedList<WarehouseTicketResponse>([], 0, request.Page, request.PageSize);
        }
        var group = await groupRepository.GetByIdAsync(kiosk.Value.GroupId);
        var userList = await userRepository.GetAllAsync();
        var userNameDicitionary = userList.Value.Entities.ToDictionary(k => k.Id.ToString(), v => v.Fullname);

        var response = tickets
            .Where(t => (string.IsNullOrEmpty(userIdentifier.GroupId) || t.GroupId == userIdentifier.GroupId) && t.Status != ActiveStatus.Deleted.ToString())
            .OrderBy(t => t.Type == "ErrorTray" ? 0 : 1)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(ticket =>
            {
                var creatorName = userNameDicitionary.GetValueOrDefault(ticket.CreatorId, "Unknown");
                return ticket.BuildAdapter()
                    .AddParameters("CreatorName", creatorName)
                    .AddParameters("KioskName", kiosk.Value.KioskName ?? string.Empty)
                    .AddParameters("GroupName", group.HasValue ? group.Value.GroupName : string.Empty)
                    .AdaptToType<WarehouseTicketResponse>();
            })
            .ToList();

        return new PagedList<WarehouseTicketResponse>(response, response.Count, request.Page, request.PageSize);
    }
}
