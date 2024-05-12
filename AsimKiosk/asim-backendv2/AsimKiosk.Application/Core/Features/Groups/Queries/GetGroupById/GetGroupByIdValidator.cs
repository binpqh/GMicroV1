using AsimKiosk.Application.Core.Common;
using AsimKiosk.Application.Core.Errors;
using AsimKiosk.Application.Core.Extensions;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.Groups.Queries.GetGroupById;

public class GetGroupByIdValidator : AbstractValidator<GetGroupByIdQuery>
{
    public GetGroupByIdValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithError(ValidationErrors.General.IsRequired("identifier"))
            .Must(HexValidator.BeAValidHex)
            .WithError(ValidationErrors.General.InvalidObjectId);
    }
}
