using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Product;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Products.Command.ChangePriorityBanners;

public class ChangePriorityBannersCommand(List<ChangePriorityRequest> banners) : ICommand<Result>
{
    public List<ChangePriorityRequest> Banners { get; set; } = banners;
}
