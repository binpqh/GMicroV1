using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Group;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Groups.Commands.UpdateGroup;

public class UpdateGroupCommand(string groupId, UpdateGroupRequest request) : ICommand<Result>
{
    public string GroupId { get; set; } = groupId;
    public UpdateGroupRequest UpdateGroupRequest { get; set; } = request;
}
