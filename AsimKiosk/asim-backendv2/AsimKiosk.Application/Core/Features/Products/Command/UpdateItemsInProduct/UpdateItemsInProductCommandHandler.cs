using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.File;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Products.Command.UpdateItemsInProduct;

internal class UpdateItemsInProductCommandHandler(IProductRepository productRepository,IFileService fileService) : ICommandHandler<UpdateItemsInProductCommand, Result>
{
    public async Task<Result> Handle(UpdateItemsInProductCommand request, CancellationToken cancellationToken)
    {
        if (!await productRepository.IsProductExistAsync(request.ProductCode))
        {
            return Result.Failure(DomainErrors.Product.NotFound);
        }

        var product = await productRepository.GetByProductCodeAsync(request.ProductCode);
        try
        {
            if (request.Items.EnglishItems is not null && request.Items.EnglishItems.Any() && request.Items.VietnameseItems is not null && request.Items.VietnameseItems.Any())
            {
                request.Items.EnglishItems.ForEach(item =>
                {
                    var itemProduct = product.Value.EnglishContent.Items.FirstOrDefault(i => i.Id == item.Id);
                    if(itemProduct is not null)
                    {
                        itemProduct.CodeItem = item.CodeItem ?? itemProduct.CodeItem;
                        itemProduct.CodeTitle = item.CodeTitle ?? itemProduct.CodeTitle;
                        itemProduct.Description = item.Description;
                        itemProduct.Price = item.Price;
                        itemProduct.Note = item.Note ?? itemProduct.Note;
                        if (item.Icon is not null)
                        {
                            itemProduct.IconItem = fileService.SaveImage(item.Icon, Domain.Enums.ImageType.Icon);
                        }
                    }
                });

                request.Items.VietnameseItems.ForEach(item =>
                {
                    var itemProduct = product.Value.VietnameseContent.Items.FirstOrDefault(i => i.Id == item.Id);
                    if(itemProduct is not null)
                    {
                        itemProduct.CodeItem = item.CodeItem ?? itemProduct.CodeItem;
                        itemProduct.CodeTitle = item.CodeTitle ?? itemProduct.CodeTitle;
                        itemProduct.Description = item.Description;
                        itemProduct.Price = item.Price;
                        itemProduct.Note = item.Note ?? itemProduct.Note;
                        if (item.Icon is not null)
                        {
                            itemProduct.IconItem = fileService.SaveImage(item.Icon, Domain.Enums.ImageType.Icon);
                        }
                    }                    
                });
                return Result.Success();
            }
            return Result.Failure(DomainErrors.Product.UpdateFailed);
        }
        catch
        {
            fileService.RollBackImageJustUpload(product.Value.VietnameseContent.Items.Select(i => i.IconItem).ToList());
            fileService.RollBackImageJustUpload(product.Value.EnglishContent.Items.Select(i => i.IconItem).ToList());
            return Result.Failure(DomainErrors.Product.UpdateFailed);
        }
    }
}
