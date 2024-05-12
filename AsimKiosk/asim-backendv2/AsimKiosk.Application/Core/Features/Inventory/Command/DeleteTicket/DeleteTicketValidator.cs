using AsimKiosk.Application.Core.Common;
using AsimKiosk.Application.Core.Errors;
using AsimKiosk.Application.Core.Extensions;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.Inventory.Command.DeleteTicket;

public class DeleteTicketValidator : AbstractValidator<DeleteTicketCommand>
{
    public DeleteTicketValidator()
    {
        RuleFor(x => x.TicketId)
            .NotEmpty()
            .WithError(ValidationErrors.General.IsRequired("TicketId"))
            .Length(24)
            .WithError(ValidationErrors.General.InvalidObjectId)
            .Must(HexValidator.BeAValidHex)
            .WithError(ValidationErrors.General.InvalidObjectId);
    }
}
