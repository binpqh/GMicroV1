using AsimKiosk.Application.Core.Features.Groups.Commands.AddUsersToGroup;
using AsimKiosk.Application.Core.Features.Groups.Commands.CreateGroup;
using AsimKiosk.Application.Core.Features.Groups.Commands.RemoveUsersFromGroup;
using AsimKiosk.Application.Core.Features.Groups.Commands.SoftDeleteGroup;
using AsimKiosk.Application.Core.Features.Groups.Commands.UpdateGroup;
using AsimKiosk.Application.Core.Features.Groups.Queries.GetGroupById;
using AsimKiosk.Application.Core.Features.Groups.Queries.GetGroupDropdown;
using AsimKiosk.Application.Core.Features.Groups.Queries.GetGroups;
using AsimKiosk.Contracts.Group;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.WebAPI.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AsimKiosk.WebAPI.Controllers;

public class GroupController(IMediator mediator) : APIController(mediator)
{
    [Authorize(Policy = "Manager")]
    [HttpGet("getAll")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAllGroups(int pageSize, int page) 
        => await Maybe<GetGroupsQuery>
        .From(new GetGroupsQuery(pageSize, page))
        .Bind(async query => await Mediator.Send(query))
            .Match(Ok, NotFound);

    [Authorize(Policy = "Manager")]
    [HttpGet("dropDown")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetIdList()
    => await Maybe<GetGroupDropdownQuery>
        .From(new GetGroupDropdownQuery())
        .Bind(async query => await Mediator.Send(query))
            .Match(Ok, NotFound);

    [Authorize(Policy = "Manager")]
    [HttpGet("get")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetGroupById(string? groupId)
        => await Maybe<GetGroupByIdQuery>
        .From(new GetGroupByIdQuery(groupId))
        .Bind(async query => await Mediator.Send(query))
            .Match(Ok, NotFound);

    [Authorize(Roles = "Administrator")]
    [HttpPost("create")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateNewGroup(string groupName)
        => await Result.Create(groupName, DomainErrors.General.UnProcessableRequest)
                        .Map(r => new CreateGroupCommand(groupName))
                        .Bind(async query => await Mediator.Send(query))
                        .Match(Ok, Failure);

    [Authorize(Policy = "Manager")]
    [HttpPatch("update")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateGroup(string groupId, UpdateGroupRequest request)
        => await Result.Create(groupId, DomainErrors.General.UnProcessableRequest)
                       .Map(r => new UpdateGroupCommand(groupId, request))
                       .Bind(async query => await Mediator.Send(query))
                       .Match(Ok, Failure);

    [Authorize(Roles = "Administrator")]
    [HttpDelete("delete")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteGroup(string groupId)
        => await Result.Create(groupId, DomainErrors.General.UnProcessableRequest)
                        .Map(r => new SoftDeleteGroupCommand(groupId))
                        .Bind(async query => await Mediator.Send(query))
                        .Match(Ok, Failure);

    [Authorize(Policy = "Manager")]
    [HttpPost("addUsersToGroup")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddUsersToGroup(string groupId, AddUsersToGroupRequest request)
        => await Result.Create(groupId, DomainErrors.General.UnProcessableRequest)
                        .Map(r => new AddUsersToGroupCommand(groupId, request))
                        .Bind(async command => await Mediator.Send(command))
                        .Match(Ok, Failure);

    [Authorize(Policy = "Manager")]
    [HttpPost("removeUsersFromGroup")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RemoveUsersFromGroup(string groupId, RemoveUsersFromGroupRequest request)
        => await Result.Create(groupId, DomainErrors.General.UnProcessableRequest)
                        .Map(r => new RemoveUsersFromGroupCommand(groupId, request))
                        .Bind(async command => await Mediator.Send(command))
                        .Match(Ok, Failure);
}
