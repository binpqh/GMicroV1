using AsimKiosk.Application.Core.Errors;
using AsimKiosk.Application.Core.Extensions;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.ConfigPayment.Command.UpdateConfigPayment;

internal class UpdateConfigPaymentValidator : AbstractValidator<UpdateConfigPaymentCommand>
{
    internal UpdateConfigPaymentValidator()
    {
        RuleFor(x => x.UpdatePaymentConfigRequest.KeySecret).NotEmpty().WithError(ValidationErrors.General.IsRequired("KeySecret"));
        RuleFor(x => x.UpdatePaymentConfigRequest.MerchantCode).NotEmpty().WithError(ValidationErrors.General.IsRequired("MerchantCode"));
        RuleFor(x => x.UpdatePaymentConfigRequest.ChannelCode).NotEmpty().WithError(ValidationErrors.General.IsRequired("ChannelCode"));
        RuleFor(x => x.UpdatePaymentConfigRequest.DomainUrl.PaymentConfig).NotEmpty().WithError(ValidationErrors.General.IsRequired("url payment configuration"));
        RuleFor(x => x.UpdatePaymentConfigRequest.DomainUrl.PaymentGateway).NotEmpty().WithError(ValidationErrors.General.IsRequired("url payment gateway"));
        RuleFor(x => x.UpdatePaymentConfigRequest.CustomerEmail).NotEmpty().WithError(ValidationErrors.General.IsRequired("KeySecret"));
        RuleFor(x => x.UpdatePaymentConfigRequest.CustomerName).NotEmpty().WithError(ValidationErrors.General.IsRequired("KeySecret"));
        RuleFor(x => x.UpdatePaymentConfigRequest.CustomerMobile)
            .NotEmpty().WithMessage("CustomerMobile must be not empty")
            .Matches(@"^0\d{9,10}$").WithError(ValidationErrors.General.IsRequired("KeySecret"));
        RuleFor(x => x.UpdatePaymentConfigRequest.IpnUrl).NotEmpty().WithError(ValidationErrors.General.IsRequired("KeySecret"));
        RuleFor(x => x.UpdatePaymentConfigRequest.RedirectUrl).NotEmpty().WithError(ValidationErrors.General.IsRequired("KeySecret"));
    }
}
