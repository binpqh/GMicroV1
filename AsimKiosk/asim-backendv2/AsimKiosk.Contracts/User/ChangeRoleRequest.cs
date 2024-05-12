

using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Contracts.User.Authentication
{
    public class ChangeRoleRequest
    {
        public string UserId { get; set; } = null!;
        public UserRole Role { get; set; }
    }
}