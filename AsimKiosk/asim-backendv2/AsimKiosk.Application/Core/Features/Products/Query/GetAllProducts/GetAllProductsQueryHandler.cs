using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Features.Products.Query.GetAllProducts;
using AsimKiosk.Contracts.Product;
using AsimKiosk.Domain.Core.File;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Product.Query.GetAllProducts;

public class GetAllProductsQueryHandler(IProductRepository productRepository, IFileService fileService)
    : IQueryHandler<GetAllProductsQuery, Maybe<List<ProductResponse>>>
{
    public async Task<Maybe<List<ProductResponse>>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
    {
        var products = (await productRepository.GetAllAsync()).Value.Entities.Select(p => new ProductResponse
        {
            Id = p.Id.ToString(),
            ProductName = p.ProductName,
            ProductCode = p.ProductCode,
            ProductIcon = fileService.GetImageByKey(p.ProductIcon),
        }).ToList(); ;

        return products;
    }
}
