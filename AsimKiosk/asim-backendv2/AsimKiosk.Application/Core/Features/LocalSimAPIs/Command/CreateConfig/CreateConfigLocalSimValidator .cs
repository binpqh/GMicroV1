using AsimKiosk.Application.Core.Errors;
using AsimKiosk.Application.Core.Extensions;
using AsimKiosk.Contracts.LocalSimApi;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.LocalSimAPIs.Command.CreateConfig;

public class CreateLocalSimConfigValidator : AbstractValidator<CreateConfigLocalSimCommand>
{
    public CreateLocalSimConfigValidator()
    {
        RuleFor(config => config.ApiConfigSimRequest.UserName).NotNull().NotEmpty().WithError(ValidationErrors.General.IsRequired("UserName"));
        RuleFor(config => config.ApiConfigSimRequest.Password).NotNull().NotEmpty().WithError(ValidationErrors.General.IsRequired("Password"));
        RuleFor(config => config.ApiConfigSimRequest.GrantType).NotNull().NotEmpty().WithError(ValidationErrors.General.IsRequired("GrantType")); 
        RuleFor(config => config.ApiConfigSimRequest.ClientId).NotNull().NotEmpty().WithError(ValidationErrors.General.IsRequired("ClientId")); 
        RuleFor(config => config.ApiConfigSimRequest.ClientSecret).NotNull().NotEmpty().WithError(ValidationErrors.General.IsRequired("ClientSecret")); 
        RuleFor(config => config.ApiConfigSimRequest.Scope).NotNull().NotEmpty().WithError(ValidationErrors.General.IsRequired("Scope")); 
        RuleFor(config => config.ApiConfigSimRequest.Realm).NotNull().NotEmpty().WithError(ValidationErrors.General.IsRequired("Realm")); 
        RuleFor(config => config.ApiConfigSimRequest.AuthUrl).NotNull().NotEmpty().WithError(ValidationErrors.General.IsRequired("AuthUrl")); 
        RuleFor(config => config.ApiConfigSimRequest.BussUrl).NotNull().NotEmpty().WithError(ValidationErrors.General.IsRequired("BussUrl")); 
    }
}
