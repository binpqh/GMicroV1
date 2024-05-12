using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.User.Authentication;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Users.Commands.RefreshToken;

internal class RefreshTokenCommandHandler(IRefreshTokenRepository refreshTokenRepository, IUserRepository userRepository, IJwtProvider jwtProvider) : ICommandHandler<RefreshTokenCommand, Result<AuthResponse>>
{
    public async Task<Result<AuthResponse>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var oldToken = await refreshTokenRepository.GetByTokenAndClientIPAsync(request.Token,request.ClientIPv4);

        if (oldToken.HasNoValue)
        {
            return Result.Failure<AuthResponse>(DomainErrors.UserAuthentication.InvalidToken);
        }

        var user = await userRepository.GetByIdAsync(oldToken.Value.UserId);

        if(user.HasNoValue)
        {
            return Result.Failure<AuthResponse>(DomainErrors.General.NotFoundSpecificObject(ObjectName.User));
        }

        oldToken.Value.Token = jwtProvider.Generate(new Contracts.Authentication.AuthenticateRequest
        {
            UserId = user.Value.Id.ToString(),
            NameIdentifier = user.Value.Username,
            GroupId = user.Value.GroupId ?? string.Empty,
            Type = ClientType.WebMonitor,
            Role = user.Value.Role,
        });
        return Result.Success(new AuthResponse{
            Token = oldToken.Value.Token,
            Role = user.Value.Role
        });
    }
}
