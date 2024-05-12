using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using AsimKiosk.Domain.ValueObject;


namespace AsimKiosk.Application.Core.Features.ConfigPayment.Command.CreateConfigPayment;

public class CreateConfigPaymentCommandHandler(IPaymentConfigRepository paymentConfigRepository,
    IUserIdentifierProvider userIdentifierProvider
    )
    : ICommandHandler<CreateConfigPaymentCommand, Result>
{
    public async Task<Result> Handle(CreateConfigPaymentCommand request, CancellationToken cancellationToken)
    {
        if(await paymentConfigRepository.IsConfigUniqueWithMerchantCodeAsync(request.CreatePaymentConfigRequest.MerchantCode))
        {
            return Result.Failure(DomainErrors.PaymentConfig.DuplicateMerchantCode);
        }

        var paymentConfig = new PaymentConfig
        (
            request.CreatePaymentConfigRequest.MerchantCode,
            request.CreatePaymentConfigRequest.DomainUrl,
            request.CreatePaymentConfigRequest.ChannelCode,
            request.CreatePaymentConfigRequest.KeySecret,
            request.CreatePaymentConfigRequest.CustomerEmail,
            request.CreatePaymentConfigRequest.CustomerMobile,
            request.CreatePaymentConfigRequest.CustomerName,
            request.CreatePaymentConfigRequest.IpnUrl,
            request.CreatePaymentConfigRequest.RedirectUrl,
            request.CreatePaymentConfigRequest.ShopId
        );
        paymentConfigRepository.Insert(paymentConfig.Create(paymentConfig, userIdentifierProvider.NameIdentifier!));
        return Result.Success();
    }
}
