using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Features.LogPeripherals.Command.Create;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.LogPeripherals.Command.CreateLog
{
    public class CreateLogUpsCommandHandler(
        ILogPeripherals logPeripherals,
        IKioskRepository kiosk,
        IMaintenanceRepository maintenanceRepository,
        IKioskIdentifierProvider kioskIdentifierProvider) : ICommandHandler<CreateLogUpsCommand, Result>
    {
        public async Task<Result> Handle(CreateLogUpsCommand res, CancellationToken cancellationToken)
        {
            var data = await kiosk.GetKioskAndroidIdAsync(kioskIdentifierProvider.DeviceId);
            if (data.HasNoValue) return Result.Failure(DomainErrors.LogPeripherals.CanNotFoundIdDevice);
            var newLog = new LogPeripherals<Ups>
            {
                DeviceId = kioskIdentifierProvider.DeviceId,
                IdPeripherals = "UPS",
                TypeLog = nameof(Ups),
                Data = new Ups
                {
                    BateryLevel = res.request.BateryLevel,
                    BatteryVoltage = res.request.BatteryVoltage,
                    ConsumedLoad = res.request.ConsumedLoad,
                    FrequencyOutput = res.request.FrequencyOutput,
                    InputVoltage = res.request.InputVoltage,
                    OutPutVoltage = res.request.OutPutVoltage,
                }
            };
            if(float.Parse(res.request.InputVoltage) < 100)
            {
                bool check = await maintenanceRepository.CheckTicket(data.Value.DeviceId, "UPS");
                if (!check)
                {
                    var newticket = Domain.Entities.Maintenance.Create("UPS", data.Value.DeviceId, data.Value.KioskName, data.Value.GroupId, LogBy.System.ToString());
                    newticket.Note = DomainErrors.Maintenance.UpsPower.Message.ToString();
                    maintenanceRepository.Insert(newticket);
                }
            }    
            logPeripherals.Insert(newLog);
            return Result.Success();
        }
    }
}
