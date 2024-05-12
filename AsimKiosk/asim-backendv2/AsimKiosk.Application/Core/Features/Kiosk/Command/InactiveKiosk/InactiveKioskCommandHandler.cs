using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Kiosk.Command.ActiveKiosk;

public class InactiveKioskCommandHandler(IKioskRepository kioskRepository, IKioskHub kioskHub)
    : ICommandHandler<InactiveKioskCommand, Result>
{
    public async Task<Result> Handle(InactiveKioskCommand request, CancellationToken cancellationToken)
    {
        var kiosk = await kioskRepository.GetKioskAndroidIdAsync(request.DeviceId);
        if (kiosk.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Kiosk));
        }
        kiosk.Value.Status = Domain.Enums.ActiveStatus.Inactive.ToString();
        await kioskHub.InacitveKiosk(kiosk.Value.DeviceId);
        return Result.Success();
    }
}
