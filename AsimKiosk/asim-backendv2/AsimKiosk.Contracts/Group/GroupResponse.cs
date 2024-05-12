using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Contracts.Group;

public class GroupDropdownResponse
{
    public string GroupId { get; set; } = string.Empty;
    public string GroupName { get; set; } = string.Empty;
}
public class GroupResponse
{
    public string GroupId { get; set; } = string.Empty;
    public string GroupName { get; set; } = string.Empty;
    public List<GroupUser> GroupUsers { get; set; } = [];
    public int KioskCount { get; set; }
    public int UserCount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class GroupUser
{
    public string Id { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string ActiveStatus { get; set; } = string.Empty;
}