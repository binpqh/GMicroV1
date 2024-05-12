using AsimKiosk.Application.Core.Errors;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.Products.Query.GetProductDetail;

public class GetProductDetailValidator : AbstractValidator<GetProductDetailQuery>
{
    public GetProductDetailValidator()
    {
        RuleFor(p => p.ProductCode).NotNull().NotEmpty().WithErrorCode(ValidationErrors.General.IsRequired("product code"));
    }
}
