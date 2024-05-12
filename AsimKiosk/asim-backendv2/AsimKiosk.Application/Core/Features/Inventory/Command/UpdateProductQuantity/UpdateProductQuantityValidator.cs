using AsimKiosk.Application.Core.Common;
using AsimKiosk.Application.Core.Errors;
using AsimKiosk.Application.Core.Extensions;
using AsimKiosk.Contracts.Inventory.WarehouseTicket;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.Inventory.Command.UpdateProductQuantity;

public sealed class UpdateProductQuantityValidator : AbstractValidator<UpdateProductQuantityCommand>
{
    public UpdateProductQuantityValidator()
    {
        RuleFor(x => x.TicketId)
            .NotEmpty()
            .WithError(ValidationErrors.General.IsRequired("TicketId"))
            .Length(24)
            .WithError(ValidationErrors.General.InvalidObjectId)
            .Must(HexValidator.BeAValidHex)
            .WithError(ValidationErrors.General.InvalidObjectId);
        RuleFor(x => x.Request).SetValidator(new ProductQuantityValidator());
    }
}

public class ProductQuantityValidator : AbstractValidator<UpdateProductQuantityRequest>
{
    public ProductQuantityValidator()
    {
        RuleFor(p => p.From)
            .GreaterThanOrEqualTo(0)
            .WithError(ValidationErrors.WarehouseTicket.NegativeNumber);
        
        RuleFor(p => p.To)
            .GreaterThanOrEqualTo(0)
            .WithError(ValidationErrors.WarehouseTicket.NegativeNumber);

        RuleFor(p => p.To)
            .GreaterThanOrEqualTo(p => p.From)
            .WithError(ValidationErrors.WarehouseTicket.InvalidValue);
        
        RuleFor(p => p.Quantity)
            .Must((product, quantity) => IsValidQuantity(product.From, product.To, quantity))
            .WithError(ValidationErrors.WarehouseTicket.QuantityMismatched);
    }

    private bool IsValidQuantity(long? from, long? to, int quantity)
    {
        if (from.HasValue && to.HasValue)
        {
            return quantity == (int)((to - from) + 1);
        }

        return true;
    }
}