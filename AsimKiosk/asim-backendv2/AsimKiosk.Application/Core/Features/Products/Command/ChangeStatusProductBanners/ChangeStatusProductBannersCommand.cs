using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Application.Core.Features.Products.Command.ChangeStatusProductBanners;

public class ChangeStatusProductBannersCommand(string imgKey, ActiveStatus activeStatus) : ICommand<Result>
{
    public string ImageKey { get; set; } = imgKey;
    public ActiveStatus Status { get; set; } = activeStatus;
}