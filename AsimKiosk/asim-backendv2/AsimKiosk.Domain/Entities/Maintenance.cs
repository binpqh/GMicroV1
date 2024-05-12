using AsimKiosk.Domain.Core.Abstractions;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Events;
using System.ComponentModel.DataAnnotations.Schema;

namespace AsimKiosk.Domain.Entities;

[Table("Maintenance")]
public class Maintenance : AggregateRoot, ISoftDeletableEntity, IAuditableEntity
{
    public string DeviceId { get; set; } = string.Empty;
    public string GroupId { get; set; } = string.Empty;
    public string KioskName {get;set;} = string.Empty;
    public string Assignee { get; set; } = string.Empty;
    public string LogBy {  get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
    public string? DeviceErrorCode { get; set; } // Define a list ErrorCode for extDevice
    public DateTime? FinishAt { get; set; }
    public string MaintenanceState { get; set; } = MaintenanceStatus.Pending.ToString();
    public string Status { get; set; } = ActiveStatus.Active.ToString();
    public DateTime? DeletedOn { get; set; }
    public DateTime? ModifiedOn { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public static Maintenance Create(string errorCode,string kioskId,string kioskName,string groupId, string logBy)
    {
        Maintenance maintenance = new Maintenance {
            DeviceErrorCode = errorCode,
            DeviceId = kioskId,
            KioskName = kioskName,
            GroupId = groupId,
            LogBy = logBy
        };
        maintenance.AddDomainEvent(new MaintenanceCreatedDomainEvent(maintenance));
        return maintenance;
    }
}
