using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.User.Authentication;
using AsimKiosk.Domain.Core.Primitives;
namespace AsimKiosk.Application.Core.Features.Users.Commands.CreateUser
{
    public class CreateUserCommand(RegisterRequest registerRequest) : ICommand<Result<RegisterResponse>>
    {
        public RegisterRequest RegisterRequest { get; set; } = registerRequest;
    }
}