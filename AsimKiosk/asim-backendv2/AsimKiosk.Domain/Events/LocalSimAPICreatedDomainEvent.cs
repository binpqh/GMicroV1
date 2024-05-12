using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Events;

public class LocalSimAPICreatedDomainEvent(LocalSimConfig localSimConfig, string createBy) : IDomainEvent
{
    public LocalSimConfig LocalSimConfig { get; set; } = localSimConfig;
    public string CreateBy { get; set; } = createBy;
}
