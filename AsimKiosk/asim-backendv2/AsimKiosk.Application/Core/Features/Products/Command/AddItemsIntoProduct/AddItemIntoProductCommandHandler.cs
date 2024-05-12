using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.File;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using AsimKiosk.Domain.ValueObject;

namespace AsimKiosk.Application.Core.Features.Products.Command.AddItemsIntoProduct;

public class AddItemIntoProductCommandHandler(IProductRepository productRepository, IFileService fileService,IUserIdentifierProvider userIdentifierProvider) : ICommandHandler<AddItemIntoProductCommand, Result>
{
    public async Task<Result> Handle(AddItemIntoProductCommand request, CancellationToken cancellationToken)
    {
        if (!await productRepository.IsProductExistAsync(request.ProductCode))
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Product));
        }

        var product = await productRepository.GetByProductCodeAsync(request.ProductCode);
        try
        {
            request.Items.EnglishItems.ForEach(item =>
            {
                product.Value.EnglishContent.Items.Add(new Item
                {
                    CodeItem = item.CodeItem,
                    CodeTitle = item.CodeTitle,
                    Description = item.Description,
                    IconItem = fileService.SaveImage(item.Icon, Domain.Enums.ImageType.Icon),
                    Price = item.Price
                });
            });

            request.Items.VietnameseItems.ForEach(item =>
            {
                product.Value.VietnameseContent.Items.Add(new Item
                {
                    CodeItem = item.CodeItem,
                    CodeTitle = item.CodeTitle,
                    Description = item.Description,
                    IconItem = fileService.SaveImage(item.Icon, Domain.Enums.ImageType.Icon),
                    Price = item.Price
                });
            });
        }
        catch
        {
            fileService.RollBackImageJustUpload(product.Value.VietnameseContent.Items.Select(i => i.IconItem).ToList());
            fileService.RollBackImageJustUpload(product.Value.EnglishContent.Items.Select(i => i.IconItem).ToList());
            return Result.Failure(DomainErrors.Product.UploadImageFailed());
        }
        product.Value.NotifyEvent(product.Value,string.IsNullOrEmpty(userIdentifierProvider.NameIdentifier) ? "System" : userIdentifierProvider.NameIdentifier);
        return Result.Success();
    }
}