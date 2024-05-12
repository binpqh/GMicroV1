using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;
using Microsoft.AspNetCore.Http;

namespace AsimKiosk.Application.Core.Features.InstructionVideo.Command.AddInstructionVideo;

public class AddInstructionVideoCommand(IFormFile video) : ICommand<Result>
{
    public IFormFile Video { get; set; } = video;
}
