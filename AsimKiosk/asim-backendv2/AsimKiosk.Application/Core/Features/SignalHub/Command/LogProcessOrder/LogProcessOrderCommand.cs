using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.ValueObject;

namespace AsimKiosk.Application.Core.Features.SignalHub.Command.LogProcessOrder;

public class LogProcessOrderCommand(OrderLogRequest req) : ICommand<Result>
{
    public OrderLogRequest Req { get; set; } = req;
}