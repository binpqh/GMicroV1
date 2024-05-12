using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Kiosk.Queries.GetKioskByDeviceId;

public class GetKioskByDeviceIdQuery(string deviceId) : IQuery<Maybe<KioskGeneralDetails>>
{
    public string DeviceId { get; set; } = deviceId;
}
