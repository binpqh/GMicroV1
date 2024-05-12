using AsimKiosk.Application.Core.Errors;
using AsimKiosk.Application.Core.Extensions;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.Groups.Commands.CreateGroup;

internal class CreateGroupCommandValidator : AbstractValidator<CreateGroupCommand>
{
    public CreateGroupCommandValidator()
    {
        RuleFor(g => g.GroupName).NotEmpty().WithError(ValidationErrors.General.IsRequired("Group name"));
    }
}
