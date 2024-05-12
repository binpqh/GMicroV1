using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.SignalHub.Query.GetKioskByDeviceId;

public class GetKioskByDeviceIdQuery(string deviceId) : IQuery<Maybe<KioskResponse>>
{
    public string DeviceId { get; set; } = deviceId;
}
