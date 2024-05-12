using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.LogAPI;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.KioskApplication.Command.LogErrorAPIForKioskApp;

public class LogAPICommand(LogAPIRequest req) : ICommand<Result>
{
    public LogAPIRequest Request { get; set; } = req;
}
