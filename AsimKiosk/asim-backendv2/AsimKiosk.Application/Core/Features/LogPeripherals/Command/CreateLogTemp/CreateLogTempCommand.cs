using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.LogPeripherals;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.LogPeripherals.Command.CreateLogTemp;
public class CreateLogTempCommand(LogTempertureRequest res) : ICommand<Result>
{
    public LogTempertureRequest request = res;
}
