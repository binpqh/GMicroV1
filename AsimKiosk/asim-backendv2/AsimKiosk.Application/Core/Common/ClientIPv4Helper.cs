using Microsoft.AspNetCore.Http;

namespace AsimKiosk.Application.Core.Common
{
    public static class ClientIPv4Helper
    {
        public static string GetClientIpAddress(HttpContext httpContext)
        {
            try
            {
                return httpContext.Request.Headers.ContainsKey("X-Forwarded-For") ?
                    httpContext.Request.Headers["X-Forwarded-For"]! : httpContext.Connection.RemoteIpAddress!.ToString();
            }
            catch
            {
                return string.Empty;
            }
        }
    }
}
