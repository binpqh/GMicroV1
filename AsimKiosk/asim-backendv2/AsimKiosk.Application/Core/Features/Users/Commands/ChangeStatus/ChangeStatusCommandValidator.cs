using AsimKiosk.Domain.Enums;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.Users.Commands.ChangeStatus
{
    public class ChangeStatusCommandValidator : AbstractValidator<ChangeStatusCommand>
    {
        public ChangeStatusCommandValidator() {
            RuleFor(x => x.ChangeStatusRequest.Status)
                .Must(IsValidStatus).WithMessage("Status doesn't exists");
            RuleFor(x => x.ChangeStatusRequest.UserId)
               .NotEmpty().WithMessage("UserId must be not empty");

        }
      
        private static bool IsValidStatus(ActiveStatus status)
        {
            if (!Enum.IsDefined(typeof(ActiveStatus), status)) return false;
            return true;

        }
    }
}
