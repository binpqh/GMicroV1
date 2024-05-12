using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Group;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Groups.Commands.AddUsersToGroup;

public class AddUsersToGroupCommand(string groupId, AddUsersToGroupRequest request) : ICommand<Result>
{
    public string GroupId { get; set; } = groupId;
    public AddUsersToGroupRequest AddUsersRequest { get; set; } = request;
}
