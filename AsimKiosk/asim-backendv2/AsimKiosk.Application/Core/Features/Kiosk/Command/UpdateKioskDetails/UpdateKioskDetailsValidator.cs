using AsimKiosk.Application.Core.Common;
using AsimKiosk.Application.Core.Errors;
using AsimKiosk.Application.Core.Extensions;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.Kiosk.Command.UpdateKioskDetails;  

public class UpdateKioskDetailsValidator : AbstractValidator<UpdateKioskDetailsCommand>
{
    public UpdateKioskDetailsValidator()
    {
        RuleFor(x => x.UpdateRequest.GroupId)
            .NotEmpty()
            .WithError(ValidationErrors.General.IsRequired("Id"))
            .Length(24)
            .WithError(ValidationErrors.General.InvalidObjectId)
            .Must(HexValidator.BeAValidHex)
            .WithError(ValidationErrors.General.InvalidObjectId);
    }
}
