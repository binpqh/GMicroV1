using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk.Peripheral;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Kiosk.Command.UpdatePeripheral;

public class UpdatePeripheralCommand(string peripheralId, string deviceId, PeripheralRequest request)
    : ICommand<Result>
{
    public string PeripheralId { get; set; } = peripheralId;
    public string DeviceId { get; set; } = deviceId;
    public PeripheralRequest PeripheralRequest { get; set; } = request;
}
