using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Events;

public class LocalSimAPIUpdatedDomainEvent(LocalSimConfig localSimConfig, string updateBy) : IDomainEvent
{
    public LocalSimConfig LocalSimConfig { get; set; } = localSimConfig;
    public string UpdateBy { get; set; } = updateBy;
}
