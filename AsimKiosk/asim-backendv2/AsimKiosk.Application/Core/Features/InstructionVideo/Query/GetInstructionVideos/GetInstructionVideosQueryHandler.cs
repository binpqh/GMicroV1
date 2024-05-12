using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.InstructionVideo;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.InstructionVideo.Query.GetInstructionVideos;

public class GetInstructionVideosQueryHandler(IInstructionVideoRepository instructionVideoRepository) : IQueryHandler<GetInstructionVideosQuery, Maybe<List<InstructionVideoResponse>>>
{
    public async Task<Maybe<List<InstructionVideoResponse>>> Handle(GetInstructionVideosQuery request, CancellationToken cancellationToken)
    {
        var instructionVideos = await instructionVideoRepository.GetAllAsync();
        return instructionVideos.Value.Entities.Adapt<List<InstructionVideoResponse>>();
    }
}
