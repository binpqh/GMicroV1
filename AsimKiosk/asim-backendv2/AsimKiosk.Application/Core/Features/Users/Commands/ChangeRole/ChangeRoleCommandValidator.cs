using AsimKiosk.Domain.Enums;
using FluentValidation;


namespace AsimKiosk.Application.Core.Features.Users.Commands.ChangeRole
{
    public class ChangeRoleCommandValidator : AbstractValidator<ChangeRoleCommand>
    {
        public ChangeRoleCommandValidator() {
            RuleFor(x => x.ChangeRoleRequest.Role)
                .NotEmpty().WithMessage("Role must be not empty")
                .Must(IsValidRole).WithMessage("Role doesn't exists");
            RuleFor(x => x.ChangeRoleRequest.UserId)
                .NotEmpty().WithMessage("UserId must be not empty");
        }
        private static bool IsValidRole(UserRole role)
        {
            if (!Enum.IsDefined(typeof(UserRole), role)) return false;
            return true;

        }
    }
}
