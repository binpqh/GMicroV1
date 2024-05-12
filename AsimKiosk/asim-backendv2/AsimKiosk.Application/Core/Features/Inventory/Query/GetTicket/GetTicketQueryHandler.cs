using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Inventory.WarehouseTicket;
using AsimKiosk.Domain.Core.File;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;
using MongoDB.Driver;

namespace AsimKiosk.Application.Core.Features.Inventory.Query.GetTicket;

public class GetTicketQueryHandler (
        IFileService fileService,
        IKioskRepository kioskRepository,
        IUserRepository userRepository,
        IUserIdentifierProvider currentUser,
        IGroupRepository groupRepository,
        IWarehouseTicketRepository warehouseTicket
    )
    : IQueryHandler<GetTicketQuery, Maybe<WarehouseTicketDetails>>
{
    public async Task<Maybe<WarehouseTicketDetails>> Handle(GetTicketQuery request, CancellationToken cancellationToken)
    {
        var ticket = await warehouseTicket.GetByIdAsync(request.Id);
        if (ticket.HasNoValue || !string.IsNullOrWhiteSpace(currentUser.GroupId) && currentUser.GroupId != ticket.Value.GroupId)
        {
            return Maybe<WarehouseTicketDetails>.None;
        }

        var productQuantities = ticket.Value.ProductQuantities.Select(p => new ProductQuantityResponse
        {
            ItemCode = p.ItemCode,
            Quantity = p.Quantity,
            From = p.From,
            To = p.To,
            CompletionState = p.CompletionState,
            DispenserSlot = p.DispenserSlot,
            AssigneeId = p.AssigneeId,
            ConfirmationImage = p.ConfirmationImageKey != null ? fileService.GetImageByKey(p.ConfirmationImageKey) : string.Empty,
            FinishedAt = p.FinishedAt,
            Assignee = p.AssigneeId == null ? string.Empty : userRepository.GetByIdAsync(p.AssigneeId).Result.Value.Fullname,
        }).ToList();

        var creator = await userRepository.GetByIdAsync(ticket.Value.CreatorId);
        var ticketGroup = await groupRepository.GetByIdAsync(ticket.Value.GroupId);
        var kiosk = await kioskRepository.GetKioskAndroidIdAsync(ticket.Value.DeviceId);
        var response = ticket.Value.BuildAdapter()
            .AddParameters("KioskName", kiosk.Value.KioskName ?? string.Empty)
            .AddParameters("CreatorName", creator.Value.Fullname ?? string.Empty)
            .AddParameters("GroupName", ticketGroup.Value.GroupName ?? string.Empty)
            .AddParameters("ProductQuantities", productQuantities)
            .AdaptToType<WarehouseTicketDetails>();
        response.DocumentKey = ticket.Value.DocumentKey ?? string.Empty;
        response.ImageKey = string.IsNullOrEmpty(ticket.Value.ImageKey) ? string.Empty : fileService.GetDocumentURLByKey(ticket.Value.ImageKey);

        return response;
    }
}
