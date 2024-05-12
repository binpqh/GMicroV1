using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Events
{
    public class OrderCreatedEventDomain(Order order) : IDomainEvent
    {
        public Order Order {get;set;} = order;
    }
}