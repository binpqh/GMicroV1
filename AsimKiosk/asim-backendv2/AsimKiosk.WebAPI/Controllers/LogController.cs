using AsimKiosk.Application.Core.Features.AsimLog.Queries.GetApiLog;
using AsimKiosk.Application.Core.Features.AsimLog.Queries.GetKioskLogs;
using AsimKiosk.Application.Core.Features.AsimLog.Queries.GetLogsByKiosk;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.WebAPI.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AsimKiosk.WebAPI.Controllers;

// [Authorize(Policy = "User")]
public class LogController(IMediator mediator) : APIController(mediator)
{
    [Authorize(Roles = "Superman")]
    [HttpGet("all")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetLogsAsync(string deviceId, DateTime from, DateTime to, int page, int pageSize)
        => await Maybe<GetApiLogQuery>.From(new GetApiLogQuery(deviceId, from, to, page, pageSize))
        .Bind(query => Mediator.Send(query))
        .Match(Ok, NotFound);
    [Authorize(Policy = "Manager")]
    [HttpGet("paginate")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetLogsByKioskAsync(string deviceId, DateTime from, DateTime to, int page, int pageSize)
        => await Maybe<GetLogsQuery>.From(new GetLogsQuery(deviceId, pageSize, page, from, to))
        .Bind(query => Mediator.Send(query))
        .Match(Ok, NotFound);
    [Authorize(Policy = "Manager")]
    [HttpGet("kiosk-log")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetKioskLogsAsync(int page, int pageSize)
        => await Maybe<GetKioskLogsQuery>.From(new GetKioskLogsQuery(pageSize, page))
        .Bind(query => Mediator.Send(query))
        .Match(Ok, NotFound);
}