using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Application.Core.Features.Kiosk.Command.ChangePeripheralStatus;

public class ChangePeripheralStatusCommand(string deviceId, string peripheralId, ActiveStatus status) : ICommand<Result>
{
    public string DeviceId { get; set; } = deviceId;
    public string PeripheralId { get; set; } = peripheralId;
    public ActiveStatus Status { get; set; } = status;
}
