using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Kiosk.Action.KioskLockerByDeviceId;

public class KioskLockerByDeviceIdAction(string? deviceId) : IAction<Result>
{
    public string DeviceId { get; set; } = deviceId ?? string.Empty;
}
