using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Application.Core.Features.Kiosk.Command.ActiveKiosk;

public class InactiveKioskCommand(string deviceId) : ICommand<Result>
{
    public string DeviceId { get; set; } = deviceId;
}
