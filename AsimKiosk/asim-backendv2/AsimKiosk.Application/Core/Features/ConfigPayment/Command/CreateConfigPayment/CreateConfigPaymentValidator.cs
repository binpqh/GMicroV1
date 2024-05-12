//using AsimKiosk.Application.Core.Errors;
//using AsimKiosk.Application.Core.Extensions;
//using FluentValidation;

//namespace AsimKiosk.Application.Core.Features.ConfigPayment.Command.CreateConfigPayment;

//public class CreateConfigPaymentValidator : AbstractValidator<CreateConfigPaymentCommand>
//{
//    public CreateConfigPaymentValidator()
//    {
//        {
//            RuleFor(x => x.CreatePaymentConfigRequest.KeySecret).NotNull().WithError(ValidationErrors.General.IsRequired("KeySecret"));
//            RuleFor(x => x.CreatePaymentConfigRequest.MerchantCode).NotNull().WithError(ValidationErrors.General.IsRequired("MerchantCode"));
//            RuleFor(x => x.CreatePaymentConfigRequest.ChannelCode).NotNull().WithError(ValidationErrors.General.IsRequired("ChannelCode"));
//            RuleFor(x => x.CreatePaymentConfigRequest.DomainUrl.PaymentConfig).NotNull().WithError(ValidationErrors.General.IsRequired("url payment configuration"));
//            RuleFor(x => x.CreatePaymentConfigRequest.DomainUrl.PaymentGateway).NotNull().WithError(ValidationErrors.General.IsRequired("url payment gateway"));
//            RuleFor(x => x.CreatePaymentConfigRequest.CustomerEmail).NotNull().WithError(ValidationErrors.General.IsRequired("KeySecret"));
//            RuleFor(x => x.CreatePaymentConfigRequest.CustomerName).NotNull().WithError(ValidationErrors.General.IsRequired("KeySecret"));
//            RuleFor(x => x.CreatePaymentConfigRequest.CustomerMobile)
//                .NotNull().WithMessage("CustomerMobile must be not empty")
//                .Matches(@"^0\d{9,10}$").WithError(ValidationErrors.General.IsRequired("KeySecret"));
//            RuleFor(x => x.CreatePaymentConfigRequest.IpnUrl).NotNull().WithError(ValidationErrors.General.IsRequired("KeySecret"));
//            RuleFor(x => x.CreatePaymentConfigRequest.RedirectUrl).NotNull().WithError(ValidationErrors.General.IsRequired("KeySecret"));
//        }
//    }
//}
