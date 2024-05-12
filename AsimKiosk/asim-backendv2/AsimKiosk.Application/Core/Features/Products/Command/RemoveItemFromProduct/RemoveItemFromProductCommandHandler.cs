using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.File;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Products.Command.RemoveItemFromProduct;

internal class RemoveItemFromProductCommandHandler(IProductRepository productRepository, IFileService fileService) : ICommandHandler<RemoveItemFromProductCommand, Result>
{
    public async Task<Result> Handle(RemoveItemFromProductCommand request, CancellationToken cancellationToken)
    {
        var product = await productRepository.GetByProductCodeAsync(request.ProductCode);
        if(product.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Product));
        }
        if(!product.Value.EnglishContent.Items.Any(i => i.CodeItem == request.ItemCode) && !product.Value.VietnameseContent.Items.Any(i => i.CodeItem == request.ItemCode))
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Item));
        }
        product.Value.EnglishContent.Items.RemoveAll(i =>
        {
            fileService.DeleteImage(i.IconItem);
            return i.Equals(request.ItemCode);
        });
        product.Value.VietnameseContent.Items.RemoveAll(i =>
        {
            fileService.DeleteImage(i.IconItem);
            return i.Equals(request.ItemCode);
        });

        return Result.Success();
    }
}
