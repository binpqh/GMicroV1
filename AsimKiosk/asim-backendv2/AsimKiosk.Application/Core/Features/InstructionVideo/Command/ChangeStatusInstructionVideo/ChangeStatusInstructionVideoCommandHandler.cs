using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.InstructionVideo.Command.ChangeStatusInstructionVideo;

internal class ChangeStatusInstructionVideoCommandHandler(IInstructionVideoRepository instructionVideoRepository) : ICommandHandler<ChangeStatusInstructionVideoCommand, Result>
{
    public async Task<Result> Handle(ChangeStatusInstructionVideoCommand request, CancellationToken cancellationToken)
    {
        var instructionVideo = await instructionVideoRepository.GetByIdAsync(request.Id);
        if (instructionVideo.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject("instruction video"));
        }
        if (request.Status == Domain.Enums.ActiveStatus.Active && await instructionVideoRepository.AnyActiveAsync())
        {
            var activeInstructionsVideo = await instructionVideoRepository.GetActiveVideoAsync();
            activeInstructionsVideo.Value.Status = ActiveStatus.Inactive.ToString();

        }
        instructionVideo.Value.Status = request.Status.ToString();
        return Result.Success();
    }
}
