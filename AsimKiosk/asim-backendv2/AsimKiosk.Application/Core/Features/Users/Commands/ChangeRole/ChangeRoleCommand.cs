using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.User.Authentication;
using AsimKiosk.Domain.Core.Primitives;


namespace AsimKiosk.Application.Core.Features.Users.Commands.ChangeRole;

public class ChangeRoleCommand(ChangeRoleRequest request) : ICommand<Result>
{
    public ChangeRoleRequest ChangeRoleRequest { get; set; } = request;
}