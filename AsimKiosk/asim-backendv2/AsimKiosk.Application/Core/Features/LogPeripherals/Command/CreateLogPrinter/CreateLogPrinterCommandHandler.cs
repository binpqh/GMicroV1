using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.LogPeripherals.Command.CreateLogPrinter;

public class CreateLogPrinterCommandHandler(
    ILogPeripherals logPeripherals,
    IKioskRepository kiosk,
    IKioskIdentifierProvider kioskIdentifierProvider,
    IMaintenanceRepository maintenanceRepository
    ) : ICommandHandler<CreateLogPrinterCommand, Result>
{
    public async Task<Result> Handle(CreateLogPrinterCommand res, CancellationToken cancellationToken)
    {
        var data = await kiosk.GetKioskAndroidIdAsync(kioskIdentifierProvider.DeviceId);
        if (data.HasNoValue) return Result.Failure(DomainErrors.LogPeripherals.CanNotFoundIdDevice);

        // if (res.request.IdPeripherals == null) return Result.Failure(DomainErrors.LogPeripherals.DeviceIdPeripheralsNull);
        var newLog = new LogPeripherals<Printer>
        {
            DeviceId = res.request.DeviceId ?? kioskIdentifierProvider.DeviceId,
            IdPeripherals = "PRI",
            TypeLog = typeof(Printer).Name,
            Data = new Printer
            {
                WarningPaper = res.request.WarningPaper,
            }
        };

        if (res.request.WarningPaper)
        {
            bool check = await maintenanceRepository.CheckTicket(data.Value.DeviceId, "Printer");
            if (!check)
            {
                var ticket = Domain.Entities.Maintenance.Create("Printer", data.Value.DeviceId, data.Value.KioskName, data.Value.GroupId,LogBy.System.ToString());
                ticket.Note = DomainErrors.Maintenance.WaringPaper.Message.ToString();
                maintenanceRepository.Insert(ticket);
            }    
        }
        logPeripherals.Insert(newLog);
        return Result.Success();
    }
}
