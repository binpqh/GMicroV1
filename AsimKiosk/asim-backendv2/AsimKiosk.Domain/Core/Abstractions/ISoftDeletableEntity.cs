﻿namespace AsimKiosk.Domain.Core.Abstractions;

/// <summary>
/// Represents the marker interface for soft-deletable entities.
/// </summary>
public interface ISoftDeletableEntity
{
    /// <summary>
    /// Gets the date and time in UTC format the entity was deleted on.
    /// </summary>
    DateTime? DeletedOn { get; set;}

    /// <summary>
    /// Gets a value indicating whether the entity has been deleted.
    /// </summary>
    string Status { get; }
}