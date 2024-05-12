using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Product;
using AsimKiosk.Domain.Core.File;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Products.Query.GetProductDetail;

internal class GetProductDetailQueryHandler(IProductRepository productRepository, IFileService fileService) : IQueryHandler<GetProductDetailQuery, Maybe<ProductDetailResponse>>
{
    public async Task<Maybe<ProductDetailResponse>> Handle(GetProductDetailQuery request, CancellationToken cancellationToken)
    {
        var product = await productRepository.GetByProductCodeAsync(request.ProductCode);

        if (product.HasNoValue)
        {
            return Maybe<ProductDetailResponse>.None;
        }

        product.Value.ProductIcon = fileService.GetImageByKey(product.Value.ProductIcon);
        product.Value.EnglishContent.PreviewImage = fileService.GetImageByKey(product.Value.EnglishContent.PreviewImage);
        product.Value.VietnameseContent.PreviewImage = fileService.GetImageByKey(product.Value.VietnameseContent.PreviewImage);
        product.Value.EnglishContent.Items.ForEach(item => 
        {
            item.IconItem = fileService.GetImageByKey(item.IconItem);
            item.IsVietnameseContent = false;
        });
        product.Value.VietnameseContent.Items.ForEach(item => {
            item.IconItem = fileService.GetImageByKey(item.IconItem);
            item.IsVietnameseContent = true;
        });

        return product.Value.Adapt<ProductDetailResponse>();
    }
}
