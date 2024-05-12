namespace AsimKiosk.Application.Core.Abstractions.Authentication;

/// <summary>
/// Represents the user identifier provider interface.
/// </summary>
public interface IKioskIdentifierProvider
{
    /// <summary>
    /// Gets the authenticated kiosk identifier.
    /// </summary>
    string DeviceId { get; }
    string? GroupId { get; }
    string HostUrl { get; } 
}
