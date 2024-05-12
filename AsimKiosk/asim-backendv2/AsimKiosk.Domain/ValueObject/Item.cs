using AsimKiosk.Domain.Core.Abstractions;

namespace AsimKiosk.Domain.ValueObject;

public class Item : GenericValueObject, IAuditableEntity
{
    public string CodeTitle { get; set; } = string.Empty;
    public string CodeItem { get; set; } = string.Empty;
    public string IconItem { get; set; } = string.Empty;
    public double Price { get; set; }
    public List<string> Description { get; set; } = [];
    public string Note { get; set; } = string.Empty;
    public bool IsVietnameseContent { get; set; }
    public DateTime? ModifiedOn { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}