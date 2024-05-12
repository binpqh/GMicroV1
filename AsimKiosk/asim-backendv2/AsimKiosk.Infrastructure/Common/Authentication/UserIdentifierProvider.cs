using System.Security.Claims;
using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace AsimKiosk.Infrastructure.Common.Authentication;

/// <summary>
/// Represents the user identifier provider.
/// </summary>
internal sealed class UserIdentifierProvider : IUserIdentifierProvider
{
    /// <summary>
    /// Initializes a new instance of the <see cref="UserIdentifierProvider"/> class.
    /// </summary>
    /// <param name="httpContextAccessor">The HTTP context accessor.</param>
    public UserIdentifierProvider(IHttpContextAccessor httpContextAccessor)
    {
        //TODO have to re-check again
        if (!httpContextAccessor.HttpContext!.User.Identity!.IsAuthenticated) return;
        try
        {
            NameIdentifier = httpContextAccessor.HttpContext?.User.Claims?.Where(c => c.Type == ClaimTypes.NameIdentifier).Select(c => c.Value).First();
            GroupId = httpContextAccessor.HttpContext?.User.Claims?.Where(c => c.Type == ClaimTypes.GroupSid).Select(c => c.Value).First();
            Role = httpContextAccessor.HttpContext?.User.Claims?.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).First();
            ClientType = (ClientType)Enum.Parse(typeof(ClientType), httpContextAccessor.HttpContext?.User.Claims?.Where(c => c.Type == "ClientType").Select(c => c.Value).First() ?? string.Empty);
        }
        catch
        {
            NameIdentifier = null;
            GroupId = null;
            Role = null;
            ClientType = null;
        }
    }

    /// <inheritdoc />
    public string? NameIdentifier { get; }

    public string? GroupId { get; }
    public string? Role { get; }

    public ClientType? ClientType { get; }
}