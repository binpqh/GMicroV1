using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Kiosk.Action.ReactiveKioskByDeviceId;

internal class ReactiveKioskByDeviceIdActionHandler(IKioskHub kioskHub) : IActionHandler<ReactiveKioskByDeviceIdAction, Result>
{
    public async Task<Result> Handle(ReactiveKioskByDeviceIdAction request, CancellationToken cancellationToken)
    {
        await kioskHub.ReactiveKioskAsync(request.DeviceId);
        return Result.Success();
    }
}
