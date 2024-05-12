using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Kiosk.Command.ApproveKioskWithDeviceId;

public class ApproveKioskWithDeviceIdCommand(string deviceId) : ICommand<Result<KioskDetailsResponse>>
{
    public string DeviceId { get; set; } = deviceId;
}
