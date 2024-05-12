using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.File;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using AsimKiosk.Domain.ValueObject;

namespace AsimKiosk.Application.Core.Features.Products.Command.CreateProduct;

public class CreateProductCommandHandler(IProductRepository productRepository, IFileService fileService,IUserIdentifierProvider userIdentifierProvider)
    : ICommandHandler<CreateProductCommand, Result>
{
    public async Task<Result> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        if (await productRepository.IsProductExistAsync(request.Value.ProductCode))
            return Result.Failure(DomainErrors.Product.DuplicateProductCode);
        Dictionary<string,string> iconImgEnglishKeys = new();
        Dictionary<string,string> iconImgVietnameseKeys = new();
        var product = new Domain.Entities.Product();
        try
        {
            product.ProductName = request.Value.ProductName;
            product.ProductCode = request.Value.ProductCode;
            product.ProductIcon = fileService.SaveImage(request.Value.ProductIcon, request.Value.ProductCode, ImageType.Icon);
            product.ColorCodePrimary = request.Value.ColorCodePrimary;
            product.ColorCodeSecondary = request.Value.ColorCodeSecondary ?? string.Empty;
            product.Hotline = request.Value.Hotline;
            product.IsRequireSerialNumber = request.Value.IsRequireSerialNumber;
            product.EnglishContent = new ProductEnglishContent
            {
                ProductTitle = request.Value.EnglishContent.Title ?? string.Empty,
                Heading = new ProductHeading
                {
                    Heading = request.Value.EnglishContent.Heading,
                    SubHeading = request.Value.EnglishContent.SubHeading,
                    Description = request.Value.EnglishContent.Description
                },
                Items = request.Value.EnglishContent.Items.Select(i => new Item
                {

                    IconItem = fileService.SaveImage(i.Icon, request.Value.ProductCode, i.CodeItem, ImageType.Icon),
                    CodeItem = i.CodeItem,
                    CodeTitle = i.CodeTitle,
                    Price = i.Price,
                    Description = i.Description,
                    Note = i.Note,
                    IsVietnameseContent = false
                })
                .ToList(),
                PreviewImage = fileService.SaveImage(request.Value.EnglishContent.ProductPreviewImage, request.Value.ProductCode, ImageType.Preview)
            };
            product.VietnameseContent = new ProductVietnameseContent
            {
                ProductTitle = request.Value.EnglishContent.Title ?? string.Empty,
                Heading = new ProductHeading
                {
                    Heading = request.Value.VietnameseContent.Heading,
                    SubHeading = request.Value.VietnameseContent.SubHeading,
                    Description = request.Value.VietnameseContent.Description
                },
                Items = request.Value.VietnameseContent.Items.Select(i => new Item
                {

                    IconItem = fileService.SaveImage(i.Icon, request.Value.ProductCode, i.CodeItem, ImageType.Icon),
                    CodeItem = i.CodeItem,
                    CodeTitle = i.CodeTitle,
                    Price = i.Price,
                    Description = i.Description,
                    Note = i.Note,
                    IsVietnameseContent = true
                })
                .ToList(),
                PreviewImage = fileService.SaveImage(request.Value.VietnameseContent.ProductPreviewImage, request.Value.ProductCode, ImageType.Preview)
            };
            productRepository.Insert(product);

            product.NotifyEvent(product, userIdentifierProvider.NameIdentifier!);
            return Result.Success();
        }
        catch (Exception ex)
        {

            fileService.RollBackImageJustUpload(product.EnglishContent.Items.Select(i => i.IconItem).ToList());
            fileService.RollBackImageJustUpload(product.VietnameseContent.Items.Select(i => i.IconItem).ToList());
            return Result.Failure(DomainErrors.Product.UploadImageFailed(ex.Message));
        }
        
    }
}