using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;


namespace AsimKiosk.Application.Core.Features.ConfigPayment.Command.UpdateConfigPayment;
public class UpdateConfigPaymentCommandHandler(IPaymentConfigRepository paymentConfigRepository,IUserIdentifierProvider userIdentifierProvider)
    : ICommandHandler<UpdateConfigPaymentCommand, Result>
{
    public async Task<Result> Handle(UpdateConfigPaymentCommand request, CancellationToken cancellationToken)
    {
        var paymentConfig = await paymentConfigRepository.GetByIdAsync(request.UpdatePaymentConfigRequest.Id);

        if (paymentConfig.HasNoValue)
        {
            return Result.Failure(DomainErrors.PaymentConfig.NotFoundWithId);
        }
       
        paymentConfig.Value.IpnUrl = string.IsNullOrEmpty(request.UpdatePaymentConfigRequest.IpnUrl) ? paymentConfig.Value.IpnUrl : request.UpdatePaymentConfigRequest.IpnUrl;
        paymentConfig.Value.UrlDomain.PaymentConfig = string.IsNullOrEmpty(request.UpdatePaymentConfigRequest.DomainUrl.PaymentConfig) ? paymentConfig.Value.UrlDomain.PaymentConfig : request.UpdatePaymentConfigRequest.DomainUrl.PaymentConfig;
        paymentConfig.Value.UrlDomain.PaymentGateway = string.IsNullOrEmpty(request.UpdatePaymentConfigRequest.DomainUrl.PaymentGateway) ? paymentConfig.Value.UrlDomain.PaymentGateway : request.UpdatePaymentConfigRequest.DomainUrl.PaymentGateway;
        paymentConfig.Value.RedirectUrl = string.IsNullOrEmpty(request.UpdatePaymentConfigRequest.RedirectUrl) ? paymentConfig.Value.RedirectUrl : request.UpdatePaymentConfigRequest.RedirectUrl;
        paymentConfig.Value.CustomerName = string.IsNullOrEmpty(request.UpdatePaymentConfigRequest.CustomerName) ? paymentConfig.Value.CustomerName : request.UpdatePaymentConfigRequest.CustomerName;
        paymentConfig.Value.CustomerEmail = string.IsNullOrEmpty(request.UpdatePaymentConfigRequest.CustomerEmail) ? paymentConfig.Value.CustomerEmail : request.UpdatePaymentConfigRequest.CustomerEmail;
        paymentConfig.Value.CustomerMobile = string.IsNullOrEmpty(request.UpdatePaymentConfigRequest.CustomerMobile) ? paymentConfig.Value.CustomerMobile : request.UpdatePaymentConfigRequest.CustomerMobile;
        paymentConfig.Value.ChannelCode = string.IsNullOrEmpty(request.UpdatePaymentConfigRequest.ChannelCode) ? paymentConfig.Value.ChannelCode : request.UpdatePaymentConfigRequest.ChannelCode;
        paymentConfig.Value.MerchantCode = string.IsNullOrEmpty(request.UpdatePaymentConfigRequest.MerchantCode) ? paymentConfig.Value.MerchantCode : request.UpdatePaymentConfigRequest.MerchantCode;
        paymentConfig.Value.KeySecret = string.IsNullOrEmpty(request.UpdatePaymentConfigRequest.KeySecret) ? paymentConfig.Value.KeySecret : request.UpdatePaymentConfigRequest.KeySecret;
        paymentConfig.Value.ShopId = string.IsNullOrEmpty(request.UpdatePaymentConfigRequest.ShopId) ? paymentConfig.Value.ShopId : request.UpdatePaymentConfigRequest.ShopId;
        paymentConfig.Value.Update(paymentConfig, userIdentifierProvider.NameIdentifier!);
        return Result.Success();
    }
}
