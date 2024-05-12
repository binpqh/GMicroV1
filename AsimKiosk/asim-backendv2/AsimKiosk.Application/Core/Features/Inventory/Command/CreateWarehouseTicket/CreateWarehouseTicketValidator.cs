using AsimKiosk.Application.Core.Common;
using AsimKiosk.Application.Core.Errors;
using AsimKiosk.Application.Core.Extensions;
using AsimKiosk.Contracts.Inventory.WarehouseTicket;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.Inventory.Command.CreateWarehouseTicket;

public sealed class CreateWarehouseTicketValidator : AbstractValidator<CreateWarehouseTicketCommand>
{
    public CreateWarehouseTicketValidator()
    {
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };

        RuleFor(x => x.Request.GroupId)
            .NotEmpty()
            .WithError(ValidationErrors.General.IsRequired("GroupId"))
            .Length(24)
            .WithError(ValidationErrors.General.InvalidObjectId)
            .Must(HexValidator.BeAValidHex)
            .WithError(ValidationErrors.General.InvalidObjectId);
        // current use-case require the kiosk to only have 4 dispensers, so we check if the product quantity has less than or equal to 4
        RuleFor(x => x.Request.ProductQuantities).Must(list => list.Count > 0).WithError(ValidationErrors.WarehouseTicket.QuantityListEmpty);
        RuleFor(x => x.Request.ProductQuantities).Must(list => list.Count <= 4).WithError(ValidationErrors.WarehouseTicket.QuantityListExceededLimit);

        RuleForEach(x => x.Request.ProductQuantities).SetValidator(new ProductQuantityValidator());
        RuleFor(x => x.Request.TicketFile)
            .NotNull()
            .Must(file => allowedExtensions.Contains(Path.GetExtension(file!.FileName).ToLower()))
            .When(x => x.Request.TicketFile != null)
            .WithError(ValidationErrors.WarehouseTicket.InvalidExtension);
    }
    private class ProductQuantityValidator : AbstractValidator<ProductQuantityRequest>
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
}

