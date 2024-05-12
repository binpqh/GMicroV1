using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Products.Command.ChangeStatusProductBanners;

internal class ChangeStatusProductBannersCommandHandler(IBannerRepository bannerRepository) : ICommandHandler<ChangeStatusProductBannersCommand, Result>
{
    public async Task<Result> Handle(ChangeStatusProductBannersCommand request, CancellationToken cancellationToken)
    {
        var banner = await bannerRepository.GetByImageKeyAsync(request.ImageKey);
        if (banner.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Banner));
        }

        banner.Value.Status = request.Status.ToString();

        return Result.Success();
    }
}