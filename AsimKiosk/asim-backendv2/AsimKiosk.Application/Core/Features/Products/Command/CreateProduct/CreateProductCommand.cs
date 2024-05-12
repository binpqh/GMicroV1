using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Product;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Products.Command.CreateProduct;
public class CreateProductCommand(ProductRequest req) : ICommand<Result>
{
    public ProductRequest Value { get; set; } = req;
}
