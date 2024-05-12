using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.KioskApplication.Queries.GetConfigByDeviceId
{
    public class GetKioskConfigByDeviceIdQuery(string deviceId) : IQuery<Maybe<KioskConfigResponse>>
    {
        public string DeviceId { get; } = deviceId;
    }
}
