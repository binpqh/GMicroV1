using AsimKiosk.Application.Core.Errors;
using AsimKiosk.Application.Core.Extensions;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.Groups.Commands.SoftDeleteGroup;

internal class SoftDeleteGroupCommandValidator : AbstractValidator<SoftDeleteGroupCommand>
{
    public SoftDeleteGroupCommandValidator()
    {
        RuleFor(g => g.GroupId).NotEmpty().WithError(ValidationErrors.General.IsRequired("Group ID"));
    }
}
