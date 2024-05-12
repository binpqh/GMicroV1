using AsimKiosk.Domain.Core.Abstractions;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace AsimKiosk.Domain.Entities;

[Table("CardStorage")]
public class CardStorage : Entity, IAuditableEntity, ISoftDeletableEntity
{
    public string TicketId { get; set; } = null!;
    public string? UUID { get; set; }
    public string DeviceId { get; set; } = null!;
    public int Slot {  get; set; }
    public string ItemCode { get; set; } = null!;   // property used to get package name
    public string StorageState { get; set; } = StorageStatus.InStorage.ToString();
    public string Status { get; set; } = ActiveStatus.Active.ToString();
    public long SerialNumber { get; set; }
    public DateTime? DeletedOn { get; set; }
    public DateTime? ModifiedOn { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
