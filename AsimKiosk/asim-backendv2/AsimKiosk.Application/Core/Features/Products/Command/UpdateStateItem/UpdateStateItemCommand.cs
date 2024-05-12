using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Products.Command.UpdateStateItemCommand;

public class UpdateStateItemCommand(string productCode, string itemCode, bool isActive) : ICommand<Result>
{
    public string ProductCode { get; set; } = productCode;
    public string ItemCode { get; set; } = itemCode;
    public bool IsActive { get; set; } = isActive;
}
