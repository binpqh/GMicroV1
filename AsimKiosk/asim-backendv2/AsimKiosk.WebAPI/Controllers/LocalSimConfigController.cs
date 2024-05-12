using AsimKiosk.Application.Core.Features.LocalSimAPIs.Command.ActiveConfig;
using AsimKiosk.Application.Core.Features.LocalSimAPIs.Command.CreateConfig;
using AsimKiosk.Application.Core.Features.LocalSimAPIs.Command.DeleteConfig;
using AsimKiosk.Application.Core.Features.LocalSimAPIs.Command.UpdateConfig;
using AsimKiosk.Application.Core.Features.LocalSimAPIs.Queries.GetAllConfig;
using AsimKiosk.Application.Core.Features.LocalSimAPIs.Queries.GetConfig;
using AsimKiosk.Application.Core.Features.LocalSimAPIs.Queries.GetConfigById;
using AsimKiosk.Application.Core.Features.LocalSimAPIs.Queries.GetPackageSim;
using AsimKiosk.Contracts.LocalSimApi;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.WebAPI.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AsimKiosk.WebAPI.Controllers;
public class LocalSimConfigController(IMediator mediator) : APIController(mediator)
{

    [Authorize(Roles = "Administrator,Superman")]
    [HttpGet("getAllConfig")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAllCofigFromDb()
            => await Maybe<GetAllConfigQuery> 
        .From(new GetAllConfigQuery())
        .Bind(query => Mediator.Send(query))
        .Match (Ok, NotFound);

    [Authorize(Roles = "Administrator,Superman")]
    [HttpGet("getById")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetConfigById(string id)
        => await Maybe<GetConfigByIdQuery>
        .From(new GetConfigByIdQuery(id))
        .Bind(query => Mediator.Send(query))
        .Match(Ok,NotFound);

    [Authorize(Roles = "Administrator,Superman")]
    [HttpGet("getActive")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetConfigActive()
        => await Maybe<GetActiveConfigLocalSimQuery> 
       .From(new GetActiveConfigLocalSimQuery())
       .Bind(query => Mediator.Send(query))
       .Match(Ok, NotFound);

    [Authorize(Roles = "Administrator,Superman")]
    [HttpPost("create")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult>Create(LocalSimConfigRequest req)
        => await Result.Create(req , DomainErrors.General.UnProcessableRequest)
         .Map(r => new CreateConfigLocalSimCommand(req))
         .Bind(query => Mediator.Send(query)) 
         .Match(Ok, BadRequest);

    [Authorize(Roles = "Administrator,Superman")]
    [HttpDelete("delete")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult>DeleteConfig(string id)
        => await Result.Create(id,DomainErrors.General.UnProcessableRequest)
        .Map(r => new DeleteConfigLocalSimCommand(id))
        .Bind(query => Mediator.Send(query))
        .Match(Ok, BadRequest);

    [Authorize(Roles = "Administrator,Superman")]
    [HttpPatch("update")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateConfig(string id,LocalSimConfigRequest localSimConfig)
        => await Result.Create(id, DomainErrors.General.UnProcessableRequest)
        .Map(r => new UpdateConfigLocalSimCommand(id,localSimConfig))
        .Bind(query => Mediator.Send(query))
        .Match(Ok, BadRequest);

    [Authorize(Roles = "Administrator,Superman")]
    [HttpPatch("active")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ActiveOneConfig(string id)
        => await Result.Create(id,DomainErrors.General.UnProcessableRequest)
        .Map(r => new ActiveConfigLocalSimCommand(id))
        .Bind(query => Mediator.Send(query))
        .Match (Ok, BadRequest);


}
