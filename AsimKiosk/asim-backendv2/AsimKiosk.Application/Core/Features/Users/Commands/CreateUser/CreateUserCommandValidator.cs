using AsimKiosk.Application.Core.Common;
using AsimKiosk.Application.Core.Errors;
using AsimKiosk.Application.Core.Extensions;
using AsimKiosk.Domain.Enums;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.Users.Commands.CreateUser;
public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator()
    {
        RuleFor(x => x.RegisterRequest.GroupId)
            .NotEmpty()
            .WithMessage("The property must not be empty.")
            .Length(24)
            .WithMessage("The property must be a 24-digit string.")
            .Must(HexValidator.BeAValidHex)
            .WithMessage("The property must be a valid hex string.")
            .When(x => x.RegisterRequest.Role != "Administrator");

        RuleFor(x => x.RegisterRequest.UserName).NotEmpty().WithError(ValidationErrors.General.IsRequired("username"));

        RuleFor(x => x.RegisterRequest.FullName).NotEmpty().WithError(ValidationErrors.General.IsRequired("fullname"));
        
        RuleFor(x => x.RegisterRequest.Email).NotEmpty().WithError(ValidationErrors.General.IsRequired("email"));

        RuleFor(x => x.RegisterRequest.Password).NotEmpty().WithError(ValidationErrors.General.IsRequired("password"));

        RuleFor(x => x.RegisterRequest.Role).NotEqual(UserRole.Superman.ToString()).WithError(ValidationErrors.User.InvalidRole);
    }
    
}