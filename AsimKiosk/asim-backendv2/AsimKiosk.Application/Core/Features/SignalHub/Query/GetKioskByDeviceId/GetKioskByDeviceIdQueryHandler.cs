using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.SignalHub.Query.GetKioskByDeviceId;

public class GetKioskByDeviceIdQueryHandler(IKioskRepository kioskRepository) : IQueryHandler<GetKioskByDeviceIdQuery, Maybe<KioskResponse>>
{
    public async Task<Maybe<KioskResponse>> Handle(GetKioskByDeviceIdQuery request, CancellationToken cancellationToken)
    {
        var kiosk = await kioskRepository.GetActiveKioskByAndroidIdAsync(request.DeviceId);
        return kiosk.HasValue ? kiosk.Value.Adapt<KioskResponse>() : Maybe<KioskResponse>.None;
    }
}
