
using AsimKiosk.Application.Core.Features.LogPeripherals.Command.Create;
using AsimKiosk.Application.Core.Features.LogPeripherals.Command.CreateLogPrinter;
using AsimKiosk.Application.Core.Features.LogPeripherals.Command.CreateLogTemp;
using AsimKiosk.Application.Core.Features.LogPeripherals.Queries.GetAll;
using AsimKiosk.Application.Core.Features.LogPeripherals.Queries.GetLogById;
using AsimKiosk.Contracts.LogPeripherals;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.WebAPI.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AsimKiosk.WebAPI.Controllers;
public class LogPeripheralsController(IMediator mediator) : APIController(mediator)
{
    [Authorize]
    [HttpGet("getByType")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(string deviceId, string logType)
         => await Maybe<GetLogByIdQuery>.From(new GetLogByIdQuery(deviceId,logType))
       .Bind(query => Mediator.Send(query))
       .Match(Ok, NotFound);
    [Authorize]
    [HttpGet("getAllById")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAllById(string deviceId, string logType)
        => await Maybe<GetAllLogByIdQuery>.From(new GetAllLogByIdQuery(deviceId,logType))
      .Bind(query => Mediator.Send(query))
      .Match(Ok, NotFound);
}
