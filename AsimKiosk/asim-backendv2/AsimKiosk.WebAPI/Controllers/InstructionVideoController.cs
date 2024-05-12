using AsimKiosk.Application.Core.Features.InstructionVideo.Command.AddInstructionVideo;
using AsimKiosk.Application.Core.Features.InstructionVideo.Command.ChangeStatusInstructionVideo;
using AsimKiosk.Application.Core.Features.InstructionVideo.Command.DeleteInstructionVideo;
using AsimKiosk.Application.Core.Features.InstructionVideo.Query.GetInstructionVideos;
using AsimKiosk.Contracts.InstructionVideo;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AsimKiosk.WebAPI.Controllers;
[Authorize(Policy = "Manager")]
public class InstructionVideoController(IMediator mediator) : APIController(mediator)
{
    [DisableRequestSizeLimit]
    [HttpPost("uploadInstructionVideo")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadVideoAsync([FromForm] InstructionVideoRequest req)
    => await Result.Create(req, DomainErrors.General.UnProcessableRequest)
        .Map(request => new AddInstructionVideoCommand(req.VideoFile))
        .Bind(command => Mediator.Send(command))
        .Match(Ok, Failure);
    [HttpDelete("deleteInstructionVideo")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteVideoAsync(string id)
    => await Result.Create(id, DomainErrors.General.UnProcessableRequest)
        .Map(request => new DeleteInstructionVideoCommand(request))
        .Bind(command => Mediator.Send(command))
        .Match(Ok, Failure);
    [HttpGet("getAll")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllAsync()
    => await Maybe<GetInstructionVideosQuery>.From(new GetInstructionVideosQuery())
        .Bind(query => Mediator.Send(query))
        .Match(Ok, NotFound);
    [HttpPut("changeStatus")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ChangeStatusAsync(string id, ActiveStatus status)
    => await Result.Create(id, DomainErrors.General.UnProcessableRequest)
        .Map(request => new ChangeStatusInstructionVideoCommand(id, status))
        .Bind(command => Mediator.Send(command))
        .Match(Ok, Failure);
}
