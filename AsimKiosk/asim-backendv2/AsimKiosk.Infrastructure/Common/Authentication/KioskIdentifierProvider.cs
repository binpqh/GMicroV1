using AsimKiosk.Application.Core.Abstractions.Authentication;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace AsimKiosk.Infrastructure.Common.Authentication;

public class KioskIdentifierProvider : IKioskIdentifierProvider
{
    public KioskIdentifierProvider(IHttpContextAccessor httpContextAccessor)
    {
        if (!httpContextAccessor.HttpContext!.User.Identity!.IsAuthenticated) return;
        var httpContext = httpContextAccessor.HttpContext;
        HostUrl = $"{httpContext!.Request.Scheme}://{httpContext.Request.Host}";
        DeviceId = httpContextAccessor.HttpContext.User.Claims!.Where(c => c.Type == "DeviceId").Select(c => c.Value).FirstOrDefault(string.Empty);
        GroupId = httpContextAccessor.HttpContext.User.Claims.Where(c => c.Type == ClaimTypes.GroupSid).Select(c => c.Value).FirstOrDefault(string.Empty);
    }
    public string DeviceId { get; set; } = string.Empty;
    public string GroupId { get; set; } = string.Empty;
    public string HostUrl { get; set; } = string.Empty;
}