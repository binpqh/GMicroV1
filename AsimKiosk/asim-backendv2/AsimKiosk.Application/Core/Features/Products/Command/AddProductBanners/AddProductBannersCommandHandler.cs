using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.File;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using static AsimKiosk.Domain.Core.Errors.DomainErrors;
using Banner = AsimKiosk.Domain.Entities.Banner;

namespace AsimKiosk.Application.Core.Features.Products.Command.AddProductBanners;

internal class AddProductBannersCommandHandler(IFileService fileService, IBannerRepository bannerRepository,
    INotificationRepository notificationRepository,
    IKioskHub kioskHub,
    IUserIdentifierProvider userIdentifierProvider,
    IUserRepository userRepository)
    : ICommandHandler<AddProductBannersCommand, Result>
{
    public async Task<Result> Handle(AddProductBannersCommand request, CancellationToken cancellationToken)
    {
        List<Banner> banner = new();
        List<string> imgKeys = new();
        int lastPriority =  await bannerRepository.GetLastIndexPriorityAsync();
        try
        {
            request.Banners
                        .ForEach(b => banner.Add(new Banner
                        {
                            ImageKey = fileService.SaveImage(b, ImageType.Banner),
                            Priority = lastPriority += 1,
                        }));
        }
        catch (Exception ex)
        {
            fileService.RollBackImageJustUpload(imgKeys);
            return !string.IsNullOrEmpty(ex.Message)
                ? Result.Failure(DomainErrors.Product.UploadImageFailed(ex.Message))
                : Result.Failure(DomainErrors.Product.UpdateFailed);
        }
        bannerRepository.InsertRange(banner);
        var user = await userRepository.GetByIdAsync(userIdentifierProvider.NameIdentifier!);
        var noti = new Domain.Entities.Notification
        {
            CreateAt = DateTime.UtcNow,
            Description = $"{user.Value.Fullname} added a banner.",
            DescriptionVN = $"{user.Value.Fullname} đã thêm một banner.",
            IdNavigateChild = banner.FirstOrDefault()?.Id.ToString() ?? string.Empty,
            ParentNavigate = ParentNavigate.Product.ToString(),
            NotifyType = TypeNotify.Changes.ToString()
        };
        notificationRepository.Insert(noti);
        await kioskHub.NotifyBannerAdded(noti);
        return Result.Success();
    }
}
