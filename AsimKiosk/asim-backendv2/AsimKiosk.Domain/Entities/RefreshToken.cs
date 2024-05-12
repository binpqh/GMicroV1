using AsimKiosk.Domain.Core.Abstractions;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Domain.Entities;

public class RefreshToken : Entity, IAuditableEntity
{
    public string UserId { get; set; } = null!;
    public string Token { get; set; } = null!;
    public string ClientIPv4 { get; set; } = null!;
    public DateTime? ModifiedOn { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
