using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.User.Authentication;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Users.Commands.Login;

public class LoginCommand(string username, string password,string clientIPv4) : ICommand<Result<AuthResponse>>
{
    public string Username { get; set; } = username;
    public string Password { get; set; } = password;
    public string ClientIPv4 { get; set; } = clientIPv4;
}
