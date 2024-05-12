using AsimKiosk.Application.Core.Abstractions.AsimPaymentHub;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Payment.Command.FetchPaymentMethod;

internal class FetchPaymentMethodCommandHandler(
    IIntegrationPaymentHub integrationPaymentHub)
    : ICommandHandler<FetchPaymentMethodCommand, Result>
{

    public async Task<Result> Handle(FetchPaymentMethodCommand request, CancellationToken cancellationToken)
    {
        var paymentMethod = await integrationPaymentHub.FetchPaymentMethodAsync(cancellationToken);
        if (paymentMethod.Count != 0)
        {
            //_paymentMethodRepository.InsertRange(paymentMethod.ToArray());
            return Result.Success(paymentMethod);
        }
        return Result.Failure(DomainErrors.PaymentMethod.CanNotFetchPaymentMethodFromPaymentHub);
    }
}
