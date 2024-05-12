using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Events;

public class OrderCompletedEvent(Order order, Dictionary<int, List<string>> errorDictionary) : IDomainEvent
{
    public Order Order { get; set; } = order;
    public Dictionary<int, List<string>> ErrorDictionary { get; set; } = errorDictionary;
}
