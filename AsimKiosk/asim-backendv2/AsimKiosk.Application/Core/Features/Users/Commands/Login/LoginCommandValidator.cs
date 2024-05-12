using AsimKiosk.Application.Core.Errors;
using AsimKiosk.Application.Core.Extensions;
using FluentValidation;


namespace AsimKiosk.Application.Core.Features.Users.Commands.Login
{
    public sealed class LoginCommandValidator : AbstractValidator<LoginCommand>
    {
        public LoginCommandValidator()
        {
            RuleFor(x => x.Username).NotEmpty().WithError(ValidationErrors.General.IsRequired("username"));

            RuleFor(x => x.Password).NotEmpty().WithError(ValidationErrors.General.IsRequired("password"));
        }
    }
}
