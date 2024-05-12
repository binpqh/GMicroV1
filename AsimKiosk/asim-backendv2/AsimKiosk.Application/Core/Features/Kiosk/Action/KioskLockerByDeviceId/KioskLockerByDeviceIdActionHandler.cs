using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Kiosk.Action.KioskLockerByDeviceId;

internal class KioskLockerByDeviceIdActionHandler(IKioskRepository kioskRepository,IKioskHub kioskHub) : IActionHandler<KioskLockerByDeviceIdAction, Result>
{
    public async Task<Result> Handle(KioskLockerByDeviceIdAction request, CancellationToken cancellationToken)
    {
        var kiosk = await kioskRepository.GetActiveKioskByAndroidIdAsync(request.DeviceId);
        if (kiosk == null || kiosk.HasNoValue)
        {
            return Result.Failure(DomainErrors.Kiosk.NotFound);
        }
        
        await kioskHub.OpenLockAsync(request.DeviceId);

        return Result.Success();
    }
}
