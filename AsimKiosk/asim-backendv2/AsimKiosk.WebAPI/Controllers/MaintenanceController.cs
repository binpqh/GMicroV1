using AsimKiosk.Application.Core.Features.Maintenance.Command.CreateTicket;
using AsimKiosk.Application.Core.Features.Maintenance.Command.DeleteTicket;
using AsimKiosk.Application.Core.Features.Maintenance.Command.FinishTicket;
using AsimKiosk.Application.Core.Features.Maintenance.Command.UpdateTicketStatus;
using AsimKiosk.Application.Core.Features.Maintenance.Queries.GetAllTickets;
using AsimKiosk.Application.Core.Features.Maintenance.Queries.GetTicketById;
using AsimKiosk.Contracts.Maintenance;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.WebAPI.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AsimKiosk.WebAPI.Controllers;

public class MaintenanceController(IMediator mediator) : APIController(mediator)
{
    [HttpPost("create")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateNewTicker(MantenanceRequestHuman req)
        => await Result.Create(req, DomainErrors.General.UnProcessableRequest)
                        .Map(r => new CreateTicketCommand(req))
                        .Bind(query => Mediator.Send(query))
                        .Match(Ok, Failure);
    //[Authorize(Policy = "Manager")]
    [HttpPatch("update")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateTicket(string idTicket, UpdateMaintenanceRequest req)
        => await Result.Create(req , DomainErrors.General.UnProcessableRequest)
                       .Map(r => new UpdateTicketCommand(idTicket,req))
                       .Bind(query => Mediator.Send(query))
                       .Match(Ok, Failure);
    [HttpPatch("doneTicket")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> FinishTicket(string idTicket)
            => await Result.Create(idTicket, DomainErrors.General.UnProcessableRequest)
                          .Map(r => new FinishTicketCommand(idTicket))
                          .Bind(query => Mediator.Send(query))
                          .Match (Ok, Failure);
    [Authorize(Policy ="Manager")]
    [HttpDelete("delete")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteTicket(string idTicket)
            => await Result.Create(idTicket,DomainErrors.General.UnProcessableRequest)
                           .Map(r=> new DeleteTicketCommand(idTicket))
                           .Bind (query => Mediator.Send(query)) 
                           .Match(Ok, Failure);
    [HttpGet("getById")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse),StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTickecById(string idTicket)
            => await Maybe<GetTicketByIdQuery>
                           .From(new GetTicketByIdQuery(idTicket))
                           .Bind (query => Mediator.Send(query)) 
                           .Match(Ok, NotFound);
    //[Authorize(Policy = "Manager")]
    [HttpGet("getAllTicket")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAllTicket(int pageSize, int page)
            => await Maybe<GetAllTicketQuery>
                           .From(new GetAllTicketQuery(pageSize, page))
                           .Bind(query => Mediator.Send(query))
                           .Match(Ok, NotFound);
 }
