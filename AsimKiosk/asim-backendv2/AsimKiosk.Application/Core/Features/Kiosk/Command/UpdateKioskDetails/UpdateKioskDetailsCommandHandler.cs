using AsimKiosk.Application.Core.Abstractions.Cryptography;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Kiosk.Command.UpdateKioskDetails;

public class UpdateKioskDetailsCommandHandler(
    IKioskRepository kioskRepository,
    IGroupRepository groupRepository,
    IAuthKey authKey,
    IKioskHub kioskHub)
    : ICommandHandler<UpdateKioskDetailsCommand, Result>
{
    public async Task<Result> Handle(UpdateKioskDetailsCommand request, CancellationToken cancellationToken)
    {
        var kiosk = await kioskRepository.GetKioskAndroidIdAsync(request.DeviceId);
        if (kiosk.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Kiosk));
        }

        if (!string.IsNullOrWhiteSpace((request.UpdateRequest.GroupId)))
        {
            var group = await groupRepository.GetByIdAsync(request.UpdateRequest.GroupId);
            if (group.HasNoValue)
            {
                return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Group));
            }

            kiosk.Value.GroupId = request.UpdateRequest.GroupId;
        }

        kiosk.Value.POSCodeTerminal = string.IsNullOrWhiteSpace(request.UpdateRequest.POSCodeTerminal) ? kiosk.Value.POSCodeTerminal : request.UpdateRequest.POSCodeTerminal;
        kiosk.Value.Address = string.IsNullOrWhiteSpace(request.UpdateRequest.Address) ? kiosk.Value.Address : request.UpdateRequest.Address;
        kiosk.Value.KeyTime = Guid.NewGuid().ToString("N");
        kiosk.Value.KioskName = string.IsNullOrWhiteSpace(request.UpdateRequest.Name) ? kiosk.Value.KioskName : request.UpdateRequest.Name;
        kiosk.Value.StoreCode = string.IsNullOrEmpty(request.UpdateRequest.StoreCode) ||
            string.IsNullOrWhiteSpace(request.UpdateRequest.StoreCode) ?
            kiosk.Value.StoreCode : request.UpdateRequest.StoreCode;
        var key = authKey.GenBasicKey(kiosk.Value.DeviceId, kiosk.Value.KeyTime);
        await kioskHub.SendSecretKeyV2(kiosk.Value.DeviceId, key);

        return Result.Success();
    }
}