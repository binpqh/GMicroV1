using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Primitives;
using Microsoft.AspNetCore.Http;

namespace AsimKiosk.Application.Core.Features.Kiosk.Command.UpdatePeripheral;

public class UploadVideoCommand(KioskUploadRequest request)
    : ICommand<Result>
{
    public string DeviceId { get; set; } = request.DeviceId;
    public IFormFile VideoFile { get; set; } = request.VideoFile;
    public int VideoDurationSecond { get; set; } = request.VideoDurationSecond;
}
