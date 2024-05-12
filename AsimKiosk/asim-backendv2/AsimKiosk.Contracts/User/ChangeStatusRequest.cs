

using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Contracts.User
{
    public class ChangeStatusRequest
    {
        public string UserId { get; set; } = null!;

        public ActiveStatus Status { get; set; }

    }
}