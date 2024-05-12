using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.InstructionVideo;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.InstructionVideo.Query.GetInstructionVideos;

public class GetInstructionVideosQuery : IQuery<Maybe<List<InstructionVideoResponse>>>
{
}
