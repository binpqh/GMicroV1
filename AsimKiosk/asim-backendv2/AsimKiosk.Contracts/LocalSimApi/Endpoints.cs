namespace AsimKiosk.Contracts.LocalSimApi;

public static class Endpoints
{
    public static string GetTokenUrl(string env) => $"/auth/realms/{env}/protocol/openid-connect/token";
    public static string GetPackages => "/vender-partner-service/api/Kiosk/datapackets";
    public static string Register => "/vender-partner-service/api/Kiosk/register-sim-begin";
}

