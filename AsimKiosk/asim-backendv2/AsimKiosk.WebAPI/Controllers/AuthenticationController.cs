using AsimKiosk.Application.Core.Features.Users.Commands.CreateUser;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.WebAPI.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AsimKiosk.Contracts.User.Authentication;
using AsimKiosk.Application.Core.Features.Users.Commands.Login;
using AsimKiosk.Contracts.User;
using AsimKiosk.Application.Core.Common;
using AsimKiosk.Application.Core.Features.Users.Commands.RefreshToken;
using AsimKiosk.Application.Core.Features.Users.Queries.GetMe;

namespace AsimKiosk.WebAPI.Controllers;

[AllowAnonymous]
public class AuthenticationController(IMediator mediator) : APIController(mediator)
{
    //[Authorize(Policy = "Manager")]
    [HttpPost("register")]
    [ProducesResponseType( StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(RegisterRequest registerRequest) =>
        await Result.Create(registerRequest, DomainErrors.General.UnProcessableRequest)
            .Map(request => new CreateUserCommand(registerRequest))
            .Bind(command => Mediator.Send(command))
            .Match(Ok, Failure);

    [AllowAnonymous]
    [HttpPost("login")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Login(LoginRequest req)
        => await Result.Create(req, DomainErrors.General.UnProcessableRequest)
            .Map(request => new LoginCommand(request.Username, request.Password, ClientIPv4Helper.GetClientIpAddress(HttpContext)))
            .Bind(command => Mediator.Send(command))
            .Match(Ok, Failure);
    [AllowAnonymous]
    [HttpPost("refreshToken")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RefreshToken(string token)
        => await Result.Create(token, DomainErrors.General.UnProcessableRequest)
            .Map(request => new RefreshTokenCommand(token, ClientIPv4Helper.GetClientIpAddress(HttpContext)))
            .Bind(command => Mediator.Send(command))
            .Match(Ok, Failure);
    [Authorize]
    [HttpGet("getMe")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetMe()
        => await Maybe<GetMeQuery>.From(new GetMeQuery()).Bind(query => Mediator.Send(query))
        .Match(Ok,NotFound);

}
