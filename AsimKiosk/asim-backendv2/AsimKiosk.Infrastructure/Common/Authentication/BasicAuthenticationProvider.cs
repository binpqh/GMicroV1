using AsimKiosk.Domain.Repositories;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;

namespace AsimKiosk.Infrastructure.Common.Authentication;

public class BasicAuthenticationProvider : AuthenticationHandler<AuthenticationSchemeOptions>
{
    private readonly IKioskRepository _kioskRepository;
    [Obsolete]
    public BasicAuthenticationProvider(IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock, IKioskRepository kioskRepository)
        : base(options, logger, encoder, clock)
    {
        _kioskRepository = kioskRepository;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        try
        {
            if (Context.WebSockets.IsWebSocketRequest || Context.GetEndpoint()?.DisplayName?.Contains("KioskHub", StringComparison.OrdinalIgnoreCase) == true)
            {
                return AuthenticateResult.NoResult();
            }
            if (Request.Headers.ContainsKey("Authorization") && Request.Headers["Authorization"].Any() && Request.Headers["Authorization"].ToString().StartsWith("Basic ", StringComparison.OrdinalIgnoreCase))
            {
                var authorizationHeaderValue = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]!);
                var credentials = Encoding.UTF8.GetString(Convert.FromBase64String(authorizationHeaderValue.Parameter!)).Split(":");
                var deviceId = credentials.First();
                var keyTime = credentials.Last();
                var kiosk = await _kioskRepository.GetActiveKioskByAndroidIdAsync(deviceId);
                if (kiosk.HasNoValue)
                {
                    return AuthenticateResult.Fail("There's no kiosk matched with client's provide");
                }
                if (keyTime == kiosk.Value.KeyTime)
                {
                    var client = new BasicAuthClient
                    {
                        AuthenticationType = "Basic",
                        IsAuthenticated = true,
                        Name = deviceId
                    };
                    var claims = new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "Kiosk"),
                        new Claim(ClaimTypes.GroupSid,kiosk.Value.GroupId),
                        new Claim("DeviceId",kiosk.Value.DeviceId)
                    };
                    var identity = new ClaimsIdentity(client, claims);
                    var principal = new ClaimsPrincipal(identity);
                    var ticket = new AuthenticationTicket(principal, Scheme.Name);
                    return AuthenticateResult.Success(ticket);
                }
            }
        }catch (Exception ex)
        {
            return AuthenticateResult.Fail(ex);
        }
        return AuthenticateResult.NoResult();
    }
}
