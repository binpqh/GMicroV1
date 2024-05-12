using AsimKiosk.Application.Core.Extensions;
using AsimKiosk.Domain.Core.Errors;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.Notification.Command.MakeAsRead;

internal class MakeAsReadValidator : AbstractValidator<MakeAsReadCommand>
{
    public MakeAsReadValidator()
    {
        RuleFor(n => n.Notifications).Must(n => n.Count > 0).WithError(DomainErrors.Notification.ListOfNoticationMustNotEmpty);
    }
}
