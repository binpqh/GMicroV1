using AsimKiosk.Application.Core.Common;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.Users.Queries.GetUsersByGroupId;

public class GetUsersByGroupIdValidator : AbstractValidator<GetUsersByGroupIdQuery>
{
    public GetUsersByGroupIdValidator()
    {
        RuleFor(x => x.GroupId)
            .NotEmpty()
            .WithMessage("The property must not be empty.")
            .Length(24)
            .WithMessage("The property must be a 24-digit string.")
            .Must(HexValidator.BeAValidHex)
            .WithMessage("The property must be a valid hex string.");
    }
}
