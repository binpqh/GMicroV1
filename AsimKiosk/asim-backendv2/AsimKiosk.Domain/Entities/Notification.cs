using AsimKiosk.Domain.Core.Primitives;
using System.ComponentModel.DataAnnotations.Schema;

namespace AsimKiosk.Domain.Entities;

[Table("Notification")]
public class Notification : Entity
{
    public string NotifyType { get; set; } = TypeNotify.Default.ToString();
    public string IdNavigateChild { get; set; } = string.Empty;
    //ParrentNavigate enum below
    public string ParentNavigate { get; set; } = string.Empty;
    public string? GroupId { get; set; }
    public string? GroupName { get; set; }
    //Id user
    public string CreateBy { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public string? DescriptionVN { get; set; } = string.Empty;
    //List user id marks as read
    public List<string> UserMarkedAsRead { get; set; } = new();
    public DateTime CreateAt { get; set; }
}
public enum TypeNotify
{
    Default,
    Created,
    Deleted,
    Changes,
    Ticket,
    OutCardIssue,
    FailOrder,
    ErrorTray,
    WarningQuantityThreshold
}
public enum ParentNavigate
{
    LocalSimConfig,
    PaymentConfig,
    Product,
    Kiosk,
    MaintenanceTicket,
    InventoryTicket,
    OrderIssue,
}
