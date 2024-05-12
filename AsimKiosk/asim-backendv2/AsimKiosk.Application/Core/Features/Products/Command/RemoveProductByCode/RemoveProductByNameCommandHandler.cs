using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.File;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Products.Command.RemoveProductByCode;

internal class RemoveProductByNameCommandHandler(IProductRepository productRepository,IUserIdentifierProvider userIdentifierProvider, IFileService fileService)
    : ICommandHandler<RemoveProductByCodeCommand, Result>
{
    public async Task<Result> Handle(RemoveProductByCodeCommand request, CancellationToken cancellationToken)
    {
        if (await productRepository.IsProductExistAsync(request.ProductCode))
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Product));
        var product = await productRepository.GetByProductCodeAsync(request.ProductCode);
        try
        {
            DeleteImages(product);
            await productRepository.RemoveAsync(product);
            product.Value.NotifyEvent(product, userIdentifierProvider.NameIdentifier!);
            return Result.Success();
        }
        catch(Exception e)
        {
            return Result.Failure(DomainErrors.Product.DeteleProductFailed(e.Message));
        }
    }
    private void DeleteImages(Domain.Entities.Product product)
    {
        try
        {
            fileService.DeleteImage(product.ProductIcon);
            fileService.DeleteImage(product.EnglishContent.PreviewImage);
            fileService.DeleteImage(product.VietnameseContent.PreviewImage);
            product.VietnameseContent.Items.ForEach(i =>
            {
                fileService.DeleteImage(i.IconItem);
            });
            product.EnglishContent.Items.ForEach(i =>
            {
                fileService.DeleteImage(i.IconItem);
            });
        }
        catch(Exception)
        {
            throw;
        }
    }
}
