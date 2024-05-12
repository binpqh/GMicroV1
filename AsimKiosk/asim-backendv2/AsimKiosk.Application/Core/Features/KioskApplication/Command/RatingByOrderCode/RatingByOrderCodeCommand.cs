using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.KioskApplication.Command.RatingByOrderCode;

public class RatingByOrderCodeCommand(string orderCode, int point) : ICommand<Result>
{
    public string OrderCode { get; set; } = orderCode;
    public int Point { get; set; } = point;
}
