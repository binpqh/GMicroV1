using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Product;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Products.Query.GetProductDetail;

public class GetProductDetailQuery(string productCode) : IQuery<Maybe<ProductDetailResponse>>
{
    public string ProductCode { get; set; } = productCode;
}
