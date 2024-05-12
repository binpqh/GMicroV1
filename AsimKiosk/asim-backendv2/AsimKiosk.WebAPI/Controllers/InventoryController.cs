using AsimKiosk.Application.Core.Features.Inventory.Command.ChangeProductQuantityStatus;
using AsimKiosk.Application.Core.Features.Inventory.Command.CreateWarehouseTicket;
using AsimKiosk.Application.Core.Features.Inventory.Command.DeleteTicket;
using AsimKiosk.Application.Core.Features.Inventory.Command.UpdateProductQuantity;
using AsimKiosk.Application.Core.Features.Inventory.Command.UpdateWarehouseTicket;
using AsimKiosk.Application.Core.Features.Inventory.Query.GetTicket;
using AsimKiosk.Application.Core.Features.Inventory.Query.GetTicketsByDeviceId;
using AsimKiosk.Application.Core.Features.Inventory.Query.GetTicketFile;
using AsimKiosk.Contracts.Inventory.WarehouseTicket;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.WebAPI.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AsimKiosk.Application.Core.Features.Inventory.Query.GetKioskInventories;
using AsimKiosk.Application.Core.Features.Inventory.Command.ClearErrorTray;

namespace AsimKiosk.WebAPI.Controllers;

public class InventoryController(IMediator mediator) : APIController(mediator)
{
    [Authorize]
    [HttpGet("getKioskInventories")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetKioskInventories()
        => await Maybe<GetKioskInventoriesQuery>
        .From(new GetKioskInventoriesQuery())
        .Bind(async query => await Mediator.Send(query))
        .Match(Ok, NotFound);

    [Authorize]
    [HttpGet("getTicketsByDeviceId")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTicketsAsync(string deviceId, int page, int pageSize)
        => await Maybe<GetTicketsByDeviceIdQuery>
        .From(new GetTicketsByDeviceIdQuery(deviceId, page, pageSize))
        .Bind(async query => await Mediator.Send(query))
        .Match(Ok, NotFound);

    [Authorize]
    [HttpGet("getTicketFile")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetFileAsync(string documentKey)
    {
        var request = new GetTicketFileQuery(documentKey);
        var bruh = await Mediator.Send(request);
        if (bruh.HasNoValue)
        {
            return NotFound();
        }
        return File(bruh.Value.Stream, bruh.Value.ContentType, bruh.Value.FileName);
    }

    [Authorize]
    [HttpGet("getTicket")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTicketAsync(string id)
        => await Maybe<GetTicketQuery>
        .From(new GetTicketQuery(id))
        .Bind(async query => await Mediator.Send(query))
        .Match(Ok, NotFound);

    [Authorize]
    [HttpPost("createTicket")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateNewTicket([FromForm] WarehouseTicketRequest request)
        => await Result.Create(request, DomainErrors.General.UnProcessableRequest)
                        .Map(r => new CreateWarehouseTicketCommand(request))
                        .Bind(async query => await Mediator.Send(query))
                        .Match(Ok, Failure);

    [Authorize]
    [HttpPost("updateTicket")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateTicket(string id, [FromForm] UpdateWarehouseTicketRequest request)
        => await Result.Create(request, DomainErrors.General.UnProcessableRequest)
                        .Map(r => new UpdateWarehouseTicketCommand(id, request))
                        .Bind(async query => await Mediator.Send(query))
                        .Match(Ok, Failure);

    [Authorize]
    [HttpPost("updateProductQuantity")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateProductQuantity(string ticketId, int slot, [FromForm] UpdateProductQuantityRequest request)
        => await Result.Create(request, DomainErrors.General.UnProcessableRequest)
                       .Map(r => new UpdateProductQuantityCommand(ticketId, slot, request))
                       .Bind(async query => await Mediator.Send(query))
                       .Match(Ok, Failure);

    [Authorize]
    [HttpPost("changeProductQuantityStatus")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CompleteTicketDispenser(string id, [FromForm] int[] slots, [FromForm] ChangeTicketDispenserStatusRequest request)
        => await Result.Create(request, DomainErrors.General.UnProcessableRequest)
                       .Map(r => new ChangeProductQuantityStatusCommand(id, slots, request))
                       .Bind(async query => await Mediator.Send(query))
                       .Match(Ok, Failure);

    [Authorize]
    [HttpDelete("deleteTicket")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteTicket(string id)
        => await Result.Create(id, DomainErrors.General.UnProcessableRequest)
                       .Map(r => new DeleteTicketCommand(id))
                       .Bind(async query => await Mediator.Send(query))
                       .Match(Ok, Failure);

    [Authorize]
    [HttpDelete("clearErrorTray")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CLearErrorTray(string ticketId, [FromForm] int[] slots, [FromForm] ChangeTicketDispenserStatusRequest request)
        => await Result.Create(ticketId, DomainErrors.General.UnProcessableRequest)
                       .Map(r => new ClearErrorTrayCommand(ticketId, slots, request))
                       .Bind(async query => await Mediator.Send(query))
                       .Match(Ok, Failure);
}
