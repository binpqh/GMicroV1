using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Events;

public class ProductNotifyDomainEvent(Product product, string userModifiedId) : IDomainEvent
{
    public Product Product { get; set; } = product;
    public string UserModifiedId { get; set; } = userModifiedId;
}
