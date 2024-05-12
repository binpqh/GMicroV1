using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Order.Command.UpdateInventory;

public class UpdateInventoryOnOrderCommand(Domain.Entities.Order order, Dictionary<int, List<string>> errorDictionary) : ICommand<Result>
{
    public Domain.Entities.Order Order { get; set; } = order;
    public Dictionary<int, List<string>> ErrorDictionary { get; set; } = errorDictionary;
}
