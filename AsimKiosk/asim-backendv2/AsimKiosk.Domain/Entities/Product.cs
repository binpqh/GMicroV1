using AsimKiosk.Domain.Core.Abstractions;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Events;
using AsimKiosk.Domain.ValueObject;
using System.ComponentModel.DataAnnotations.Schema;

namespace AsimKiosk.Domain.Entities;

/// <summary>
/// This entity like a seed to initialize the specified data
/// Its has relational with "Group" Entity
/// A group has many product available to sell by kiosks in that group
/// </summary>
[Table("Product")]
public class Product : AggregateRoot, IAuditableEntity, ISoftDeletableEntity
{
    public string ProductName { get; set; } = null!;
    public string ProductCode { get; set; } = string.Empty;
    public string ProductIcon { get; set; } = string.Empty;
    public string ColorCodePrimary { get; set; } = string.Empty;
    public string ColorCodeSecondary { get; set; } = string.Empty;
    public string Hotline { get; set; } = string.Empty;
    public bool IsRequireSerialNumber { get; set; } = false;
    public ProductEnglishContent EnglishContent { get; set; } = new();
    public ProductVietnameseContent VietnameseContent { get; set; } = new();
    public DateTime? ModifiedOn { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedOn { get; set; }
    public string Status { get; set; } = ActiveStatus.Active.ToString();
    public void NotifyEvent(Product product, string userModifiedId)
    {
        product.AddDomainEvent(new ProductNotifyDomainEvent(product, userModifiedId));
    }
}