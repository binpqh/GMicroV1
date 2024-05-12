using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.InstructionVideo.Command.DeleteInstructionVideo;

public class DeleteInstructionVideoCommand(string videoId) : ICommand<Result>
{
    public string VideoId { get; set; } = videoId;
}
