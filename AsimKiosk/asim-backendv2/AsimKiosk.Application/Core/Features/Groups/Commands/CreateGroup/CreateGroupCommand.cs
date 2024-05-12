using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Group;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Groups.Commands.CreateGroup;

public class CreateGroupCommand(string groupName) : ICommand<Result>
{
    public string GroupName { get; set; } = groupName;
}
