using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Domain.Entities;

public class InstructionVideo : Entity
{
    public string VideoUrl { get; set; } = string.Empty;
    public string VideoKey { get; set; } = string.Empty;
    public string Status { get; set; } = ActiveStatus.Inactive.ToString();
}
