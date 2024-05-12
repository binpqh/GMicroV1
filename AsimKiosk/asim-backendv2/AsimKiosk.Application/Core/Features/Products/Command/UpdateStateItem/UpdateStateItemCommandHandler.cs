using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Products.Command.UpdateStateItemCommand;

internal class UpdateStateItemCommandHandler(IProductRepository productRepository) : ICommandHandler<UpdateStateItemCommand, Result>
{
    public async Task<Result> Handle(UpdateStateItemCommand request, CancellationToken cancellationToken)
    {
        var product = await productRepository.GetByProductCodeAsync(request.ProductCode);
        if (product.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Product));
        }
        if (!product.Value.EnglishContent.Items.Any(i => i.CodeItem == request.ItemCode) && !product.Value.VietnameseContent.Items.Any(i => i.CodeItem == request.ItemCode))
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Item));
        }
        var itemEn = product.Value.EnglishContent.Items.First(e => e.CodeItem == request.ItemCode);
        itemEn.IsActive = request.IsActive;
        var itemVn = product.Value.VietnameseContent.Items.First(e => e.CodeItem == request.ItemCode);
        itemVn.IsActive = request.IsActive;
        return Result.Success();
    }
}
