using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.LogPeripherals;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.LogPeripherals.Command.Create;

public class CreateLogUpsCommand(LogPeripheralsRequest res) : ICommand<Result>
{
    public LogPeripheralsRequest request = res;
}
