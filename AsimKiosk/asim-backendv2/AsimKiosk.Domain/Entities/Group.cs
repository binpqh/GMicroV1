using AsimKiosk.Domain.Core.Abstractions;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace AsimKiosk.Domain.Entities;

[Table("Group")]
public class Group : AggregateRoot, IAuditableEntity
{
    public string GroupName { get; set; } = null!;
    //public List<string> UserIds { get; set; } = new();
    public string Status { get; set; } = ActiveStatus.Active.ToString();
    public DateTime? ModifiedOn { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public static Group Create(string name)
    {
        var group = new Group
        {
            GroupName = name,
        };
        return group;
    }
}
