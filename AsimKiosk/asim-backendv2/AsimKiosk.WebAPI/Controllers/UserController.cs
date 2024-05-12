using AsimKiosk.Application.Core.Features.Maintenance.Queries.GetTicketById;
using AsimKiosk.Application.Core.Features.Users.Commands.ChangePassword;
using AsimKiosk.Application.Core.Features.Users.Commands.ChangeRole;
using AsimKiosk.Application.Core.Features.Users.Commands.ChangeStatus;
using AsimKiosk.Application.Core.Features.Users.Commands.UpdateUser;
using AsimKiosk.Application.Core.Features.Users.Queries.GetUserById;
using AsimKiosk.Application.Core.Features.Users.Queries.GetUserInGroup;
using AsimKiosk.Application.Core.Features.Users.Queries.GetUsers;
using AsimKiosk.Application.Core.Features.Users.Queries.GetUsersByGroupId;
using AsimKiosk.Application.Core.Features.Users.Queries.GetUsersNoGroup;
using AsimKiosk.Contracts.User;
using AsimKiosk.Contracts.User.Authentication;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.WebAPI.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Drawing.Printing;

namespace AsimKiosk.WebAPI.Controllers;

//[Authorize]
public class UserController(IMediator mediator) : APIController(mediator)
{
    [Authorize]
    [HttpGet()]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(string? userId) =>
        await Maybe<GetUserByIdQuery>
            .From(new GetUserByIdQuery(userId))
            .Bind(query => Mediator.Send(query))
            .Match(Ok, NotFound);

    [Authorize]
    [HttpGet("getAll")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAllUsers(int pageSize,int page) =>
        await Maybe<GetUsersQuery>
        .From(new GetUsersQuery(pageSize, page))
        .Bind(query => Mediator.Send(query))
        .Match(Ok, NotFound);

    [Authorize]
    [HttpGet("GetListUserByIdGroup")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetListUser(string idGroup) => 
        await Maybe<GetListUserQueries>
        .From(new GetListUserQueries(idGroup))
        .Bind(query => Mediator.Send(query))
        .Match(Ok, NotFound);

    [Authorize(Policy = "Manager")]
    [HttpGet("getUserInGroup")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUsersByGroupId(string groupId, int page, int pageSize) =>
        await Maybe<GetUsersByGroupIdQuery>
            .From(new GetUsersByGroupIdQuery(groupId, page, pageSize))
            .Bind(query => Mediator.Send(query))
            .Match(Ok, NotFound);

    [Authorize(Policy = "Manager")]
    [HttpPost("update")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateUserById(UpdateUserRequest req) =>
                    await Result.Create(req, DomainErrors.General.UnProcessableRequest)
                    .Map(request => new UpdateUserCommand(request))
                    .Bind(command => Mediator.Send(command))
                    .Match(Ok, Failure);

    [Authorize(Policy = "Manager")]
    [HttpPost("changeRole")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateUserRole(ChangeRoleRequest req) =>
        await Result.Create(req, DomainErrors.General.UnProcessableRequest)
                       .Map(request => new ChangeRoleCommand(request))
                       .Bind(command => Mediator.Send(command))
                       .Match(Ok, Failure);
    [Authorize(Policy = "Manager")]
    [HttpPost("changeStatus")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> ChangeUserStatus(ChangeStatusRequest request) =>
       await Result.Create(request, DomainErrors.General.UnProcessableRequest)
                      .Map(request => new ChangeStatusCommand(request))
                      .Bind(command => Mediator.Send(command))
                      .Match(Ok, Failure);
    [Authorize]
    [HttpPost("changePassword")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest req) =>
        await Result.Create(req, DomainErrors.General.UnProcessableRequest)
                .Map(request => new ChangeUserPasswordCommand(request))
                .Bind(command => Mediator.Send(command))
                .Match(Ok, Failure);
    [Authorize(Roles = "Administrator,Superman")]
    [HttpGet("getUsersNoGroup")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUsersNoGroup(int page, int pageSize) =>
        await Maybe<GetUsersNoGroupQuery>
            .From(new GetUsersNoGroupQuery(page, pageSize))
            .Bind(query => Mediator.Send(query))
            .Match(Ok, NotFound);

}
