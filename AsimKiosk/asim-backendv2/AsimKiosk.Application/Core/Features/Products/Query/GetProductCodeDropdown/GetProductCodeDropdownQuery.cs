using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Product;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Products.Query.GetProductCodeDropdown;

public class GetProductCodeDropdownQuery : IQuery<Maybe<List<ProductDropdownResponse>>>
{
    
}