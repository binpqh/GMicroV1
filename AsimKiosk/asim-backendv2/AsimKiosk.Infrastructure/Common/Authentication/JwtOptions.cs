namespace AsimKiosk.Infrastructure.Common.Authentication;

public class JwtOptions
{
    public string Issuer { get; set; } = Environment.GetEnvironmentVariable("JwtOptions__Issuer") ?? "https://localhost:44304";
    public string Audience { get; set; } = Environment.GetEnvironmentVariable("JwtOptions__Audience") ?? "https://localhost:44304";
    public string SecretKey { get; set; } = Environment.GetEnvironmentVariable("JwtOptions__SecretKey") ?? "zxVtR7rWPRdwNbbOQIfVOUMIcRwki8Jo";
}
