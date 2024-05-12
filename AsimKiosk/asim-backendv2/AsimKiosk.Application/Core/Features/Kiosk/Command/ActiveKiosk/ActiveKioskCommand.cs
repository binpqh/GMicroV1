using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Kiosk.Command.ActiveKiosk;

public class ActiveKioskCommand(string deviceId) : ICommand<Result>
{
    public string DeviceId { get; set; } = deviceId;
}
