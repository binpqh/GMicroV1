using AsimKiosk.Application.Core.Abstractions.Cryptography;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.SignalHub.Command.ProvideSecretKeyForKiosk;

internal class ProvideSecretKeyForKioskCommandHandler(IKioskRepository kioskRepository, IAuthKey authKey)
    : ICommandHandler<ProvideSecretKeyForKioskCommand, Result<string>>
{
    public async Task<Result<string>> Handle(ProvideSecretKeyForKioskCommand request, CancellationToken cancellationToken)
    {
        var kiosk = await kioskRepository.GetActiveKioskByAndroidIdAsync(request.DeviceId);
        if(kiosk.HasNoValue)
        {
            return Result.Failure<string>(DomainErrors.General.NotFoundSpecificObject(ObjectName.Kiosk));
        }
        kiosk.Value.KeyTime = Guid.NewGuid().ToString("N");
        return authKey.GenBasicKey(request.DeviceId,kiosk.Value.KeyTime);
    }
}
