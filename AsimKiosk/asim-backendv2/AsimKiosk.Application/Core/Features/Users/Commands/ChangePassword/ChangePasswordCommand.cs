
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.User.Authentication;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Users.Commands.ChangePassword;

public class ChangeUserPasswordCommand(ChangePasswordRequest request) : ICommand<Result>
{
    public ChangePasswordRequest ChangeUserPasswordRequest { get; set; } = request;
}