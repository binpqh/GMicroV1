using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Product;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Products.Command.AddItemsIntoProduct;

public class AddItemIntoProductCommand(string productCode, AddItemsRequest request) : ICommand<Result>
{
    public string ProductCode { get; set; } = productCode;
    public AddItemsRequest Items { get; set; } = request;
}
