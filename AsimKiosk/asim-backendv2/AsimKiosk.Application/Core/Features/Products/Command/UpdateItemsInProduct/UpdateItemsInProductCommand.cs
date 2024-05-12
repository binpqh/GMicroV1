using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Product;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Products.Command.UpdateItemsInProduct;

public class UpdateItemsInProductCommand(string productCode, UpdateItemsRequest request) : ICommand<Result>
{
    public string ProductCode { get; set; } = productCode;
    public UpdateItemsRequest Items { get; set; } = request;
}
