using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using AsimKiosk.Domain.ValueObject;

namespace AsimKiosk.Application.Core.Features.SignalHub.Command.LogProcessOrder;

public class LogProcessOrderCommandHandler(IOrderRepository orderRepository) : ICommandHandler<LogProcessOrderCommand,Result>
{
    public async Task<Result> Handle(LogProcessOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await orderRepository.GetOrderByOrderCodeAsync(request.Req.orderCode);

        if (order.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Order));
        }

        order.Value.LogProcessOrder.Add(new OrderLog
        {
            Message = request.Req.message,
            ExtDeviceCode = request.Req.extDeviceCode
        });

        return Result.Success();
    }
}