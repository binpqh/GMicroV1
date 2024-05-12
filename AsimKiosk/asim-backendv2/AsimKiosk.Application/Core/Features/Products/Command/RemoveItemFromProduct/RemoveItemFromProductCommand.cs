using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Products.Command.RemoveItemFromProduct;

public class RemoveItemFromProductCommand(string productCode, string itemCode) : ICommand<Result>
{
    public string ProductCode { get; set; } = productCode;
    public string ItemCode { get; set; } = itemCode;
}
