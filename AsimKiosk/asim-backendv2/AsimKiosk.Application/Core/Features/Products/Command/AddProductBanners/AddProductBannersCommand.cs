using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;
using Microsoft.AspNetCore.Http;

namespace AsimKiosk.Application.Core.Features.Products.Command.AddProductBanners;

public class AddProductBannersCommand(List<IFormFile> banners)
    : ICommand<Result>
{
    public List<IFormFile> Banners { get; set; } = banners;
}