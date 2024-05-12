using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Kiosk.Action.RebootKioskByDeviceId;

public class RebootKioskByDeviceIdAction(string deviceId) : IAction<Result>
{
    public string DeviceId { get; set; } = deviceId;
}
