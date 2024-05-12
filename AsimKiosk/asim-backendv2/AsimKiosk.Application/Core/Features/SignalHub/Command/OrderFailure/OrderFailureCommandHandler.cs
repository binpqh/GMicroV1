using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.SignalHub.Command.OrderFailure;

internal class OrderFailureCommandHandler(IOrderRepository orderRepository) : ICommandHandler<OrderFailureCommand, Result>
{
    public async Task<Result> Handle(OrderFailureCommand request, CancellationToken cancellationToken)
    {
        var order = await orderRepository.GetOrderByOrderCodeAsync(request.OrderCode);
        if (order.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject("order"));
        }

        order.Value.StatusOrder = OrderStatus.Cancelled.ToString();
        return Result.Success();
    }
}
