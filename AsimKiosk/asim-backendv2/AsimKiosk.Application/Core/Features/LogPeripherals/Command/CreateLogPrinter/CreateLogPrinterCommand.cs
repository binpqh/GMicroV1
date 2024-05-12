using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.LogPeripherals;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.LogPeripherals.Command.CreateLogPrinter;

public class CreateLogPrinterCommand(LogPrinterRequest logPeripherals) : ICommand<Result>
{
    public LogPrinterRequest request = logPeripherals;
}

