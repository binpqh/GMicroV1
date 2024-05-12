using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Group;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Groups.Commands.RemoveUsersFromGroup;

public class RemoveUsersFromGroupCommand(string groupId, RemoveUsersFromGroupRequest request) : ICommand<Result>
{
    public string GroupId { get; set; } = groupId;
    public RemoveUsersFromGroupRequest RemoveUsersRequest { get; set; } = request;
}
