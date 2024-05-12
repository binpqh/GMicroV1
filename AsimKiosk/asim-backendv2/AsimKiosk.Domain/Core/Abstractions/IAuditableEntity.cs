namespace AsimKiosk.Domain.Core.Abstractions;

/// <summary>
/// Represents the marker interface for auditable entities.
/// </summary>
public interface IAuditableEntity
{
    /// <summary>
    /// Gets the created on date and time in UTC format.
    /// </summary>
    DateTime CreatedAt { get; set; }
    /// <summary>
    /// Gets the modified on date and time in UTC format.
    /// </summary>
    DateTime? ModifiedOn { get; set; }

}