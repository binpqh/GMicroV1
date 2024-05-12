using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Product;
using AsimKiosk.Domain.Core.File;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Products.Query.GetBanners;

public class GetBannersQueryHandler(IBannerRepository bannerRepository,IFileService fileService) : IQueryHandler<GetBannersQuery,Maybe<List<BannerResponse>>>
{
    public async Task<Maybe<List<BannerResponse>>> Handle(GetBannersQuery request, CancellationToken cancellationToken)
    {
        var banners = await bannerRepository.GetAllNotDeteledAsync();

        if (!banners.Any())
        {
            return Maybe<List<BannerResponse>>.None;
        }

        return banners.Select(p => new BannerResponse
        {
            ImageKey = fileService.GetImageByKey(p.ImageKey),
            Priority = p.Priority,
            IsActive = p.Status == ActiveStatus.Active.ToString(),
        }).OrderBy(p=> p.Priority).ToList();
    }
}