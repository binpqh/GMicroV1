using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.ConfigPayment.Command.ChangeStatusConfigPayment
{
    public class ChangeStatusConfigPaymentCommandHandler(IPaymentConfigRepository paymentConfigRepository)
    : ICommandHandler<ChangeStatusConfigPaymentCommand, Result>
    {
        public async Task<Result> Handle(ChangeStatusConfigPaymentCommand request, CancellationToken cancellationToken)
        {
            var paymentConfig = await paymentConfigRepository.GetByIdAsync(request.ChangeStatusPaymentConfigRequest.PaymentConfigId);

            if (paymentConfig.HasNoValue)
            {
                return Result.Failure(DomainErrors.PaymentConfig.NotFoundWithId);
            }

            var requestedStatus = request.ChangeStatusPaymentConfigRequest.Status.ToString();
            var currentStatus = paymentConfig.Value.Status.ToString();
         
            if (currentStatus == requestedStatus)
            {
                return Result.Failure(DomainErrors.PaymentConfig.DuplicateStatus);
            }

            if (requestedStatus == ActiveStatus.Active.ToString())
            {
                var currentActivePaymentConfig = await paymentConfigRepository.GetPaymentConfigActiveAsync();

                if (currentActivePaymentConfig.HasValue)
                {
                    paymentConfig.Value.Status = ActiveStatus.Active.ToString();
                    currentActivePaymentConfig.Value.Status = ActiveStatus.Inactive.ToString();
                    return Result.Success();
                }
            }

            paymentConfig.Value.Status = requestedStatus;
            return Result.Success();
        }



    }
}
