using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.File;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Kiosk.Command.UpdatePeripheral;

public class UploadVideoCommandHandler(IFileService fileService, IKioskRepository kioskRepository, IVideoRepository videoRepository,IKioskIdentifierProvider kioskIdentifierProvider)
    : ICommandHandler<UploadVideoCommand, Result>
{
    public async Task<Result> Handle(UploadVideoCommand request, CancellationToken cancellationToken)
    {
        var kiosk = await kioskRepository.GetKioskAndroidIdAsync(request.DeviceId);

        if (kiosk.HasNoValue)
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Kiosk));

        videoRepository.Insert(new Domain.Entities.Video
        {
            DeviceId = kioskIdentifierProvider.DeviceId,
            VideoKey = await fileService.SaveVideoAsync(
            request.VideoFile,
            request.VideoFile.FileName// de tam tinh sau
            ),
            VideoSize = request.VideoFile.Length,
            VideoSecondDuration = request.VideoDurationSecond
        });

        
        return Result.Success();
    }
}
