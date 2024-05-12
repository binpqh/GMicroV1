using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Contracts.Notification;

public class NotificationResponse
{
    public List<NotificationDetail> NotificationDetails { get; set; } = new();
    public int UnreadNumber { get; set; }
}
public class NotificationDetail
{
    public string Id { get; set; } = string.Empty;
    public string NotifyType { get; set; } = TypeNotify.Default.ToString();
    public string IdNavigateChild { get; set; } = string.Empty;
    public string ParentNavigate { get; set; } = string.Empty;
    public string GroupId { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    
    public string Description { get; set; } = string.Empty;
    public string DescriptionVN { get; set; } = string.Empty;
}
