using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Application.Core.Abstractions.Authentication;

/// <summary>
/// Represents the user identifier provider interface.
/// </summary>
public interface IUserIdentifierProvider
{
    /// <summary>
    /// Gets the authenticated user identifier.
    /// </summary>
    string? NameIdentifier { get; }
    string? GroupId { get; }
    string? Role { get; }
    ClientType? ClientType { get; }
}