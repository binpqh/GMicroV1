using AsimKiosk.Application.Core.Errors;
using AsimKiosk.Application.Core.Extensions;
using AsimKiosk.Domain.Core.Errors;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.Users.Commands.ChangePassword;

public class ChangePasswordValidator : AbstractValidator<ChangeUserPasswordCommand>
{
    public ChangePasswordValidator()
    {
        RuleFor(x => x.ChangeUserPasswordRequest.NewPassword)
            .Equal(x => x.ChangeUserPasswordRequest.ConfirmPassword)
            .WithError(ValidationErrors.User.PasswordDoesNotMatch);
    }
}
