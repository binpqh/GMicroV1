using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.User.Authentication;
using AsimKiosk.Domain.Core.Abstractions;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Users.Commands.Login;

internal sealed class LoginCommandHandler(
    IUserRepository userRepository,
    IJwtProvider jwtProvider,
    IPasswordHashChecker passwordHashChecker,
    IRefreshTokenRepository refreshTokenRepository)
    : ICommandHandler<LoginCommand, Result<AuthResponse>>
{
    public async Task<Result<AuthResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByUsernameAsync(request.Username);

        if (user.HasNoValue)
        {
            return Result.Failure<AuthResponse>(DomainErrors.UserAuthentication.InvalidUsername);
        }
        else if (user.Value.Status != ActiveStatus.Active.ToString())
        {
            return Result.Failure<AuthResponse>(DomainErrors.UserAuthentication.InvalidUsername);
        }
        var isPasswordValid = passwordHashChecker.HashesMatch(request.Password, user.Value);

        if (!isPasswordValid)
        {
            return Result.Failure<AuthResponse>(DomainErrors.UserAuthentication.InvalidPassword);
        }

        var oldToken = await refreshTokenRepository.GetByUserIdAsync(user.Value.Id.ToString());

        if(oldToken.HasValue && oldToken.Value.ClientIPv4 == request.ClientIPv4)
        {
            oldToken.Value.Token = jwtProvider.Generate(new Contracts.Authentication.AuthenticateRequest
            {
                UserId = user.Value.Id.ToString(),
                NameIdentifier = user.Value.Username,
                GroupId = user.Value.GroupId ?? string.Empty,
                Type = ClientType.WebMonitor,
                Role = user.Value.Role,
            });
            return Result.Success(new AuthResponse
            {
                Token = oldToken.Value.Token,
                Role = user.Value.Role
            });
        }
        else
        {
            string token = jwtProvider.Generate(new Contracts.Authentication.AuthenticateRequest
            {
                UserId = user.Value.Id.ToString(),
                NameIdentifier = user.Value.Username,
                GroupId = user.Value.GroupId ?? string.Empty,
                Type = ClientType.WebMonitor,
                Role = user.Value.Role,
            });

            refreshTokenRepository.Insert(new Domain.Entities.RefreshToken
            {
                ClientIPv4 = request.ClientIPv4,
                Token = token,
                UserId = user.Value.Id.ToString()
            });

            return Result.Success(new AuthResponse
            {
                Token = token,
                Role = user.Value.Role
            });
        }
    }
}
