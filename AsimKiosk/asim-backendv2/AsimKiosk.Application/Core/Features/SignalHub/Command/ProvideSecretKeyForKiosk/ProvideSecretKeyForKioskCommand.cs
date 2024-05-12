using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.SignalHub.Command.ProvideSecretKeyForKiosk;

internal class ProvideSecretKeyForKioskCommand(string deviceId) : ICommand<Result<string>>
{
    public string DeviceId { get; set; } = deviceId;
}
