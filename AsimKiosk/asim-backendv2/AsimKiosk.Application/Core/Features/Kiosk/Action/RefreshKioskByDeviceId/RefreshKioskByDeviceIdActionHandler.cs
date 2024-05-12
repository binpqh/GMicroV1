using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Kiosk.Action.RefreshKioskByDeviceId;

internal class RefreshKioskByDeviceIdActionHandler(IKioskRepository kioskRepository, IKioskHub kioskHub) : IActionHandler<RefreshKioskByDeviceIdAction, Result>
{
    public async Task<Result> Handle(RefreshKioskByDeviceIdAction request, CancellationToken cancellationToken)
    {
        if (await kioskRepository.IsKioskExistWithDeviceIdAsync(request.DeviceId))
        {
            await kioskHub.RefreshKioskAsync(request.DeviceId);
            return Result.Success();
        }
        else
        {
            return Result.Failure(DomainErrors.General.NotFoundObject);
        }
    }
}
