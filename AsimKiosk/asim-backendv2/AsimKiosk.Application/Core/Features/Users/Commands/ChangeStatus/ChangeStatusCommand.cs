using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.User;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Users.Commands.ChangeStatus;

public class ChangeStatusCommand(ChangeStatusRequest request) : ICommand<Result>
{
    public ChangeStatusRequest ChangeStatusRequest { get; set; } = request;
}
