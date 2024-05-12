using AsimKiosk.Application.Core.Features.Kiosk.Command.UpdatePeripheral;
using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace AsimKiosk.Application.Core.Features.Kiosk.Command.UpdateKioskDetails;

public class UploadVideoValidator : AbstractValidator<UploadVideoCommand>
{
    public UploadVideoValidator()
    {
        RuleFor(x => x.VideoFile)
            .Must(IsVideo)
            .WithMessage("The video must be video file");
    }

    public bool IsVideo(IFormFile videoFile)
    {
        if (videoFile == null || videoFile.Length == 0)
        {
            return false;
        }

        var allowedExtensions = new[] { ".mp4", ".avi", ".mkv", ".mov" };

        var fileExtension = Path.GetExtension(videoFile.FileName).ToLower();

        return allowedExtensions.Contains(fileExtension);
    }
}
