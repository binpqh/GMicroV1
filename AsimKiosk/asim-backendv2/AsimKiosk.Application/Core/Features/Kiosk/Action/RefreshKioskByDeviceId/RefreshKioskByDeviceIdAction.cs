using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Kiosk.Action.RefreshKioskByDeviceId;

public class RefreshKioskByDeviceIdAction(string deviceId) : IAction<Result>
{
    public string DeviceId { get; set; } = deviceId;
}
