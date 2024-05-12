using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.User.Authentication;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Users.Commands.UpdateUser;

public class UpdateUserCommand(UpdateUserRequest request) : ICommand<Result>
{
    public UpdateUserRequest UpdateUserRequest { get; set; } = request;
}
