
using AsimKiosk.Domain.Enums;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.ConfigPayment.Command.ChangeStatusConfigPayment;

public class ChangeStatusConfigPaymentCommandValidator : AbstractValidator<ChangeStatusConfigPaymentCommand>
{
    public ChangeStatusConfigPaymentCommandValidator()
    {
        RuleFor(x => x.ChangeStatusPaymentConfigRequest.Status)
          .Must(IsValidStatus).WithMessage("Status doesn't exists");
        RuleFor(x => x.ChangeStatusPaymentConfigRequest.PaymentConfigId)
           .NotEmpty().WithMessage("PaymentConfigId must be not empty");
    }

    private static bool IsValidStatus(ActiveStatus status)
    {
        if (!Enum.IsDefined(typeof(ActiveStatus), status)) return false;
        return true;
    }
}
