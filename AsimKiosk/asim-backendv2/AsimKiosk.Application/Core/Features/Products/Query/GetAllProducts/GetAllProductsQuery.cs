using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Product;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Products.Query.GetAllProducts;

public class GetAllProductsQuery : IQuery<Maybe<List<ProductResponse>>>
{
}
