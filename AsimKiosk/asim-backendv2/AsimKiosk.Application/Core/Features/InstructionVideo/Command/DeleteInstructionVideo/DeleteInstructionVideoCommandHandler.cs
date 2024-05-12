using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.File;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.InstructionVideo.Command.DeleteInstructionVideo;

internal class DeleteInstructionVideoCommandHandler(IInstructionVideoRepository instructionVideoRepository, IFileService fileService) : ICommandHandler<DeleteInstructionVideoCommand, Result>
{
    public async Task<Result> Handle(DeleteInstructionVideoCommand request, CancellationToken cancellationToken)
    {
        var instructionVideo = await instructionVideoRepository.GetByIdAsync(request.VideoId);
        if (instructionVideo.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject("video"));
        }
        fileService.DeleteImage(instructionVideo.Value.VideoKey);
        await instructionVideoRepository.RemoveAsync(instructionVideo);
        return Result.Success();
    }
}
