using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Kiosk.Command.ApproveKioskWithDeviceId;

internal class ApproveKioskWithDeviceIdCommandHandler(IKioskRepository kioskRepository)
    : ICommandHandler<ApproveKioskWithDeviceIdCommand, Result<KioskDetailsResponse>>
{
    public async Task<Result<KioskDetailsResponse>> Handle(ApproveKioskWithDeviceIdCommand request, CancellationToken cancellationToken)
    {
        if(await kioskRepository.IsKioskExistWithDeviceIdAsync(request.DeviceId))
        {
            var kiosk = await kioskRepository.GetKioskAndroidIdAsync(request.DeviceId);
            if (kiosk.Value.Status == Domain.Enums.ActiveStatus.Inactive.ToString())
            {
                kiosk.Value.Status = Domain.Enums.ActiveStatus.Active.ToString();
                return Result.Success(new KioskDetailsResponse
                {
                    DeviceId = kiosk.Value.DeviceId,
                    Name = kiosk.Value.KioskName,
                    HealthStatus = "100%",
                    Peripherals = kiosk.Value.Peripherals.Select(p => new PeripheralKiosk 
                    { 
                        Id = p.Id,
                        PeripheralName = p.Name, 
                        HealStatus = p.Health
                    }).ToList(),
                    Inventories = kiosk.Value.Inventories.Select(i => new InventoryKiosk 
                    {   
                        ItemCode = i.ItemCode,
                        Slot = i.DispenserSlot, 
                        Quantity = i.InventoryQuantity,
                        IsActive =  i.IsActive
                    }).ToList()
                });
            }
        }
        else
        {
            var newKiosk = Domain.Entities.Kiosk.Create(request.DeviceId, string.Empty, string.Empty);
            kioskRepository.Insert(newKiosk);
            return Result.Success(new KioskDetailsResponse
            {
                DeviceId = newKiosk.DeviceId,
                Name = newKiosk.KioskName,
                HealthStatus = "100%",
                Peripherals = newKiosk.Peripherals.Select(p => new PeripheralKiosk 
                { 
                    Id = p.Id,
                    PeripheralName = p.Name, 
                    HealStatus = p.Health 
                }).ToList(),
                Inventories = newKiosk.Inventories.Select(i => new InventoryKiosk 
                {
                    ItemCode = i.ItemCode,
                    Slot = i.DispenserSlot,
                    Quantity = i.InventoryQuantity,
                    IsActive = i.IsActive
                }).ToList(),
                Status = newKiosk.Status.ToString(),
            });
        }
        return Result.Failure<KioskDetailsResponse>(DomainErrors.General.UnProcessableRequest);
        
    }
}
