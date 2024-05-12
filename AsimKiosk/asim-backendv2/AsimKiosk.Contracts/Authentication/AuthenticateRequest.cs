using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Contracts.Authentication;

public class AuthenticateRequest
{
    public string UserId { get; set; } = string.Empty;
    public string NameIdentifier { get; set; } = string.Empty;
    public string GroupId { get; set; } = string.Empty;
    public ClientType Type { get; set; }
    public string Role { get; set; } = string.Empty;
}
