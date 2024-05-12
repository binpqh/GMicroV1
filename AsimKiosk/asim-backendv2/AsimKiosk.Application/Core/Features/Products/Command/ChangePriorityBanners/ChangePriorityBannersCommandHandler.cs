using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Products.Command.ChangePriorityBanners;

internal class ChangePriorityBannersCommandHandler(IBannerRepository bannerRepository) : ICommandHandler<ChangePriorityBannersCommand, Result>
{
    public async Task<Result> Handle(ChangePriorityBannersCommand request, CancellationToken cancellationToken)
    {
        var banners = await bannerRepository.GetAllAsync();

        if(banners.HasNoValue) return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Banner));

        if (banners.Value.Entities.Where(b => b.Status != ActiveStatus.Deleted.ToString()).ToList().Count != request.Banners.Count) return Result.Failure(DomainErrors.Banner.NotEnoughBanners);

        request.Banners.ForEach(b =>
        {
             banners.Value.Entities.Where(banner => banner.ImageKey == b.ImageKey).Select(banner => banner.Priority = b.Priority).ToList();
        });
        
        return Result.Success();
    }
}