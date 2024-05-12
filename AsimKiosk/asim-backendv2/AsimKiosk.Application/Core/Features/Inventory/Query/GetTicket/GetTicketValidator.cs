using AsimKiosk.Application.Core.Common;
using AsimKiosk.Application.Core.Errors;
using AsimKiosk.Application.Core.Extensions;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.Inventory.Query.GetTicket;

public class GetTicketValidator : AbstractValidator<GetTicketQuery>
{
    public GetTicketValidator()
    {
        RuleFor(x => x.Id)
           .NotEmpty()
            .WithError(ValidationErrors.General.IsRequired("Id"))
            .Length(24)
            .WithError(ValidationErrors.General.InvalidObjectId)
            .Must(HexValidator.BeAValidHex)
            .WithError(ValidationErrors.General.InvalidObjectId);
    }
}
