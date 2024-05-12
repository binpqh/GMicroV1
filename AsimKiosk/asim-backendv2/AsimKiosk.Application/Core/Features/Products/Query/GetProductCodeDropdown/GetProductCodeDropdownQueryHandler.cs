using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Product;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Products.Query.GetProductCodeDropdown;

public class GetProductCodeDropdownQueryHandler(IProductRepository productRepository) : IQueryHandler<GetProductCodeDropdownQuery,Maybe<List<ProductDropdownResponse>>>
{
    public async Task<Maybe<List<ProductDropdownResponse>>> Handle(GetProductCodeDropdownQuery request, CancellationToken cancellationToken)
    {
        var products = await productRepository.GetAllAsync();
        return products.HasValue
            ? products.Value.Entities.Select(p => 
            {
                var response = new ProductDropdownResponse
                {
                    ProductCode = p.ProductCode,
                    ItemCodes = p.EnglishContent.Items.Select(i => i.CodeItem).ToList(),
                };
                return response;
            }
            ).ToList()
            : Maybe<List<ProductDropdownResponse>>.None;
    }
}