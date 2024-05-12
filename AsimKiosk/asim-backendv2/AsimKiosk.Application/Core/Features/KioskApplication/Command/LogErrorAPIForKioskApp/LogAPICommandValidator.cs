using FluentValidation;

namespace AsimKiosk.Application.Core.Features.KioskApplication.Command.LogErrorAPIForKioskApp;

internal class LogAPICommandValidator : AbstractValidator<LogAPICommand>
{
    public LogAPICommandValidator()
    {
        RuleFor(l => l.Request.UrlAPI).NotEmpty();
    }
}
