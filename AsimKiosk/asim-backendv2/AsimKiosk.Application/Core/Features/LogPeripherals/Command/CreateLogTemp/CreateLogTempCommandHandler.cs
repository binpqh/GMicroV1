
using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using Microsoft.Extensions.Configuration;

namespace AsimKiosk.Application.Core.Features.LogPeripherals.Command.CreateLogTemp;

public class CreateLogTempCommandHandler(
    ILogPeripherals logPeripherals,
    IKioskRepository kiosk,
    IKioskIdentifierProvider identifierProvider,
    IMaintenanceRepository maintenanceRepository,
    IConfiguration configuration
    ) : ICommandHandler<CreateLogTempCommand, Result>
{
    public async Task<Result> Handle(CreateLogTempCommand res, CancellationToken cancellationToken)
    {
        var maxTemp = configuration.GetSection("MaxTemp").Value;
        var data = await kiosk.GetKioskAndroidIdAsync(identifierProvider.DeviceId);
        if (data.HasNoValue) return Result.Failure(DomainErrors.LogPeripherals.CanNotFoundIdDevice);
        // if (res.request.IdPeripherals == null) return Result.Failure(DomainErrors.LogPeripherals.DeviceIdPeripheralsNull);
        var newLog = new LogPeripherals<Temperture>
        {
            DeviceId = identifierProvider.DeviceId,
            IdPeripherals = "TEM",
            TypeLog = nameof(Temperture),
            Data = new Temperture
            {
                TempertureNow = res.request.TempertureNow,
            }
        };
        if(float.Parse(res.request.TempertureNow) >= int.Parse(maxTemp))
          {
            bool check = await maintenanceRepository.CheckTicket(data.Value.DeviceId, "Temperture");
            if (!check)
            {
                var newticket = Domain.Entities.Maintenance.Create("Temperture", data.Value.DeviceId, data.Value.KioskName, data.Value.GroupId, LogBy.System.ToString());
                newticket.Note = DomainErrors.Maintenance.OverHeading.Message.ToString();
                maintenanceRepository.Insert(newticket);
            }
          }
        logPeripherals.Insert(newLog);
        
        return Result.Success();
    }
}
