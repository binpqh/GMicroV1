using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Products.Command.RemoveProductByCode;
public class RemoveProductByCodeCommand(string productCode) : ICommand<Result>
{
    public string ProductCode { get; set; } = productCode;
}
