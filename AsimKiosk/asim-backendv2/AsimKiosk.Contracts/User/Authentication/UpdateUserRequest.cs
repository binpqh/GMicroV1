namespace AsimKiosk.Contracts.User.Authentication;

public class UpdateUserRequest
{
    public string Id { get; set; } = null!;
    public string? Email { get; set; } = string.Empty;
    public string? FullName { get; set; } = string.Empty;
    public string? Address { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; } = string.Empty;
    public string? Role { get; set; } = string.Empty;
}
