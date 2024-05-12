using AsimKiosk.Domain.Core.Abstractions;
using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Domain.ValueObject;

public class Peripheral : GenericValueObject, IAuditableEntity
{
    public string Code { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Path { get; set; } 
    public string Health { get; set; } = HealthStatus.Healthy.ToString();
    public string Status { get; set; } = ActiveStatus.Active.ToString();
    public List<HistoryPeripheral> HistoryPeripherals { get; set; } = [];
    public DateTime? ModifiedOn { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
