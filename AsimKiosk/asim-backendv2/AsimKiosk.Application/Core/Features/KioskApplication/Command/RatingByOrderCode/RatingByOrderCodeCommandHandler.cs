using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.KioskApplication.Command.RatingByOrderCode;

internal class RatingByOrderCodeCommandHandler(IOrderRepository orderRepository)
    : ICommandHandler<RatingByOrderCodeCommand, Result>
{
    public async Task<Result> Handle(RatingByOrderCodeCommand request, CancellationToken cancellationToken)
    {
        if(request.Point > 5 && request.Point < 0 )
        {
            return Result.Failure(DomainErrors.Rating.OutOfRange);
        }
        if (!await orderRepository.CheckOrderIsExistAsync(request.OrderCode))
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Order));
        await orderRepository.Rating(request.OrderCode, request.Point);
        return Result.Success();
    }
}
