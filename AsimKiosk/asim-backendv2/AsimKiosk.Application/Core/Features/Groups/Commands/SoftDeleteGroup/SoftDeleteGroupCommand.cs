using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Groups.Commands.SoftDeleteGroup;

public class SoftDeleteGroupCommand(string groupId) : ICommand<Result>
{
    public string GroupId { get; set; } = groupId;
}
