using AsimKiosk.Application.Core.Common;
using AsimKiosk.Application.Core.Errors;
using AsimKiosk.Application.Core.Extensions;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.Inventory.Command.UpdateWarehouseTicket;

public class UpdateWarehouseTicketValidator : AbstractValidator<UpdateWarehouseTicketCommand>
{
    public UpdateWarehouseTicketValidator()
    {
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
        RuleFor(x => x.Request.TicketFile)
            .Must(file => allowedExtensions.Contains(Path.GetExtension(file!.FileName).ToLower()))
            .When(x => x.Request.TicketFile != null)
            .WithError(ValidationErrors.WarehouseTicket.InvalidExtension);
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithError(ValidationErrors.General.IsRequired("Id"))
            .Length(24)
            .WithError(ValidationErrors.General.InvalidObjectId)
            .Must(HexValidator.BeAValidHex)
            .WithError(ValidationErrors.General.InvalidObjectId);
    }
}
