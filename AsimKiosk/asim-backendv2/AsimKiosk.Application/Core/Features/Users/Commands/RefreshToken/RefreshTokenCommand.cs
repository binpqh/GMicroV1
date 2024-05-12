using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.User.Authentication;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Users.Commands.RefreshToken;

public class RefreshTokenCommand(string token, string clientIPv4) : ICommand<Result<AuthResponse>>
{
    public string Token { get; set; } = token;
    public string ClientIPv4 { get; set; } = clientIPv4;
}