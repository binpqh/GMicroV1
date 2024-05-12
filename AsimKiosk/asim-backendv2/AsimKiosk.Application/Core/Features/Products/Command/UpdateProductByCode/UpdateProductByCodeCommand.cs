using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Product;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Products.Command.UpdateProductByCode;

public class UpdateProductByCodeCommand(string productCode, UpdateProductOnlyRequest request) : ICommand<Result>
{
    public string Code { get; set; } = productCode;
    public UpdateProductOnlyRequest Request { get; set; } = request;
}
