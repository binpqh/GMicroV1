using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.File;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.InstructionVideo.Command.AddInstructionVideo;

internal class AddInstructionVideoCommandHandler(IInstructionVideoRepository instructionVideoRepository, IFileService fileService) : ICommandHandler<AddInstructionVideoCommand, Result>
{
    public async Task<Result> Handle(AddInstructionVideoCommand request, CancellationToken cancellationToken)
    {   
        var (videoUrl,videoKey) = await fileService.SaveInstructionVideoAsync(request.Video);
        if (string.IsNullOrEmpty(videoKey))
        {
            return Result.Failure(DomainErrors.Video.UploadVideoFailed);
        }
        var instructionVideo = new Domain.Entities.InstructionVideo
        {
            VideoUrl = videoUrl,
            VideoKey = videoKey
        };
        instructionVideoRepository.Insert(instructionVideo);
        return Result.Success();
    }
}
