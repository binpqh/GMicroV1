using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Application.Core.Features.InstructionVideo.Command.ChangeStatusInstructionVideo;

public class ChangeStatusInstructionVideoCommand(string id, ActiveStatus status) : ICommand<Result>
{
    public string Id { get; set; } = id;
    public ActiveStatus Status { get; set; } = status;
}
