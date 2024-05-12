using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Order;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Order.Query.DropdownSearch;

public class DropdownSearchQuery(string queryString, int number) : IQuery<Maybe<List<OrderDropdownResponse>>>
{
    public string QueryString { get; set; } = queryString.ToLower();
    public int Number { get; set; } = number;
}
