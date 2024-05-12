using AsimKiosk.Application.Core.Common;
using AsimKiosk.Application.Core.Errors;
using AsimKiosk.Application.Core.Extensions;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.Inventory.Command.ChangeProductQuantityStatus;

public class ChangeProductQuantityStatusValidator : AbstractValidator<ChangeProductQuantityStatusCommand>
{
    public ChangeProductQuantityStatusValidator()
    { 
        RuleFor(x => x.TicketId)
            .NotEmpty()
            .WithError(ValidationErrors.General.IsRequired("Id"))
            .Length(24)
            .WithError(ValidationErrors.General.InvalidObjectId)
            .Must(HexValidator.BeAValidHex)
            .WithError(ValidationErrors.General.InvalidObjectId);
        RuleForEach(x => x.Slots).Must(x => x > 0 && x <= 4).WithError(ValidationErrors.WarehouseTicket.InvalidSlot);
    }
}
