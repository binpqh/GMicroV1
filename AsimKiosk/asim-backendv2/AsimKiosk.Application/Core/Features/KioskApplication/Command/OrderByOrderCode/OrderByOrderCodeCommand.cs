using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Payment;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.KioskApplication.Command.OrderByOrderCode;

public class OrderByOrderCodeCommand(CheckOrderRequest request) : ICommand<Result>
{
    public int Quantity { get; set; } = request.Quantity;
    public string ItemCode { get; set; } = request.ItemCode;
    public string OrderCode { get; set; } = request.OrderCode;
}
