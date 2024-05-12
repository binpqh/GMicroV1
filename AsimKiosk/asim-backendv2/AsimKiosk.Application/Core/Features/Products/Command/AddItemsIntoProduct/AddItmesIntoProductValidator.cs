using AsimKiosk.Contracts.Product;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.Products.Command.AddItemsIntoProduct;

internal class AddItmesIntoProductValidator : AbstractValidator<AddItemIntoProductCommand>
{
    public AddItmesIntoProductValidator()
    {
        RuleFor(p => p.ProductCode).NotEmpty().WithMessage("Product code is required.");
        RuleFor(p => p.Items).Must(IsItemsMatch).WithMessage("Items is not valid.");
    }
    private bool IsItemsMatch(AddItemsRequest command)
    {
        if(command.EnglishItems.Any() &&
            command.VietnameseItems.Any() &&
            command.EnglishItems.Count == command.VietnameseItems.Count)
        {
            for(int i = 0; i < command.EnglishItems.Count; i++)
            {
                if (command.VietnameseItems[i].CodeItem != command.EnglishItems[i].CodeItem)
                {
                    return false;
                }
            }
        }
        return true;
    }
}
