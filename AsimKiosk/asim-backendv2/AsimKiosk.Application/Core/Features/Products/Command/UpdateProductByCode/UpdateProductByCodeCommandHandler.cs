using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.File;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Products.Command.UpdateProductByCode;

public class UpdateProductByCodeCommandHandler(IProductRepository productRepository, IUserIdentifierProvider userIdentifierProvider,IFileService fileService) : ICommandHandler<UpdateProductByCodeCommand, Result>
{
    public async Task<Result> Handle(UpdateProductByCodeCommand request, CancellationToken cancellationToken)
    {
        var product = await productRepository.GetByProductCodeAsync(request.Code);
        if (product.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Product));
        }
        else
        {
            product.Value.ProductName = request.Request.ProductName ?? product.Value.ProductName;
            product.Value.ProductIcon = fileService.SaveImage(request.Request.ProductIcon, request.Code.ToUpper() ?? product.Value.ProductCode,ImageType.Icon);
            product.Value.ColorCodePrimary = request.Request.ColorCodePrimary ?? product.Value.ColorCodePrimary;
            product.Value.ColorCodeSecondary = request.Request.ColorCodeSecondary ?? product.Value.ColorCodeSecondary;
            product.Value.Hotline = request.Request.Hotline;
            product.Value.EnglishContent.ProductTitle = request.Request.EnglishContent.Title ?? product.Value.EnglishContent.ProductTitle;
            product.Value.VietnameseContent.ProductTitle = request.Request.VietnameseContent.Title ?? product.Value.VietnameseContent.ProductTitle;
            product.Value.VietnameseContent.PreviewImage = fileService.SaveImage(request.Request.VietnameseContent.ProductPreviewImage, request.Code.ToUpper() ?? product.Value.ProductCode, ImageType.Preview);
            product.Value.EnglishContent.PreviewImage = fileService.SaveImage(request.Request.EnglishContent.ProductPreviewImage, request.Code.ToUpper() ?? product.Value.ProductCode, ImageType.Preview);
            product.Value.IsRequireSerialNumber = request.Request.IsRequireSerialNumber;
            product.Value.EnglishContent.Heading = product.Value.EnglishContent.Heading is null ?
            new Domain.ValueObject.ProductHeading
            {
                Heading = request.Request.EnglishContent.Heading,
                SubHeading = request.Request.EnglishContent.SubHeading,
                Description = request.Request.EnglishContent.Description
            } : new Domain.ValueObject.ProductHeading
            {
                Heading = request.Request.EnglishContent.Heading ?? product.Value.EnglishContent.Heading.Heading,
                SubHeading = request.Request.EnglishContent.SubHeading ?? product.Value.EnglishContent.Heading.SubHeading,
                Description = request.Request.EnglishContent.Description ?? product.Value.EnglishContent.Heading.Description
            };
            product.Value.VietnameseContent.Heading = product.Value.VietnameseContent.Heading is null ?
            new Domain.ValueObject.ProductHeading
            {
                Heading = request.Request.VietnameseContent.Heading,
                SubHeading = request.Request.VietnameseContent.SubHeading,
                Description = request.Request.VietnameseContent.Description
            } : new Domain.ValueObject.ProductHeading
            {
                Heading = request.Request.VietnameseContent.Heading ?? product.Value.VietnameseContent.Heading.Heading,
                SubHeading = request.Request.VietnameseContent.SubHeading ?? product.Value.VietnameseContent.Heading.SubHeading,
                Description = request.Request.VietnameseContent.Description ?? product.Value.VietnameseContent.Heading.Description
            };
            product.Value.NotifyEvent(product, userIdentifierProvider.NameIdentifier!);
            return Result.Success();
        }
    }
}
