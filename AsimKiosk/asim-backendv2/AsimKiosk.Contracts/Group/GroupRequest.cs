using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Contracts.Group;

public class UpdateGroupRequest
{
    public string GroupName { get; set; } = string.Empty;
    public string ActiveStatus { get; set; } = string.Empty;
}
public class AddUsersToGroupRequest
{
    public List<string> UserIds { get; set; } = [];
}
public class RemoveUsersFromGroupRequest : AddUsersToGroupRequest
{

}