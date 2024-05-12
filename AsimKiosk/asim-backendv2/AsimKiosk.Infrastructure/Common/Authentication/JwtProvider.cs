using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Contracts.Authentication;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AsimKiosk.Infrastructure.Common.Authentication;

internal sealed class JwtProvider(IOptions<JwtOptions> options) : IJwtProvider
{
    private readonly JwtOptions _jwtOptions = options.Value;

    public string Generate(AuthenticateRequest req)
    {
        var claims = new Claim[]
        {
            new(ClaimTypes.NameIdentifier, req.UserId),
            new(ClaimTypes.Name,req.NameIdentifier),
            new(ClaimTypes.GroupSid, req.GroupId),
            new(ClaimTypes.Role, req.Role),
            new("ClientType", req.Type.ToString()),
        };

        var signingCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey)),
                SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _jwtOptions.Issuer,
            audience: _jwtOptions.Audience,
            claims,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: signingCredentials);
            
        var jwtTokenHandler = new JwtSecurityTokenHandler();
        var jwtToken = jwtTokenHandler.WriteToken(token);

        return jwtToken;
    }
}
