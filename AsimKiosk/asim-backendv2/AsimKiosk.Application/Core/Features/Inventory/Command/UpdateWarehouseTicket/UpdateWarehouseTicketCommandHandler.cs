using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.File;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using Microsoft.VisualBasic.FileIO;
using System.Reflection.Metadata;

namespace AsimKiosk.Application.Core.Features.Inventory.Command.UpdateWarehouseTicket;

public class UpdateWarehouseTicketCommandHandler(
    IFileService fileService,
    IUserIdentifierProvider currentUser,
    IWarehouseTicketRepository warehouseTicket
    ) : ICommandHandler<UpdateWarehouseTicketCommand, Result>
{
    public async Task<Result> Handle(UpdateWarehouseTicketCommand request, CancellationToken cancellationToken)
    {
        var ticket = await warehouseTicket.GetByIdAsync(request.Id);
        if (ticket.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject("The ticket with the specified identifier did not exist."));
        }

        if ((currentUser.Role!.Equals("User") && currentUser.NameIdentifier != ticket.Value.CreatorId) ||
            (currentUser.Role.Equals("ManagerGroup") && currentUser.GroupId != ticket.Value.GroupId))
        {
            return Result.Failure(DomainErrors.Permission.InvalidPermissions);
        }

        ticket.Value.Description = request.Request.Description;

        if (request.Request.TicketFile != null)
        {
            (var key, var type) = fileService.SaveTicketDocument(request.Request.TicketFile, ticket.Value.DeviceId);
            if (type.Equals(UploadType.Document.ToString()))
            {
                ticket.Value.DocumentKey = key;
                ticket.Value.ImageKey = string.Empty;
            }
            else
            {
                ticket.Value.DocumentKey = string.Empty;
                ticket.Value.ImageKey = key;
            }
        }

        return Result.Success();
    }
}
