using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Kiosk.Action.RebootKioskByDeviceId;

internal class RebootKioskByDeviceIdActionHandler(IKioskHub kioskHub)
    : IActionHandler<RebootKioskByDeviceIdAction, Result>
{
    public async Task<Result> Handle(RebootKioskByDeviceIdAction request, CancellationToken cancellationToken)
    {
        await kioskHub.InvokeReboot(request.DeviceId);
        return Result.Success();
    }
}
