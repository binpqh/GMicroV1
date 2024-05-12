using Microsoft.AspNetCore.Authorization;

namespace AsimKiosk.WebAPI.Authentication
{
    public class KioskAuthorizedAttribute : AuthorizeAttribute
    {
        public KioskAuthorizedAttribute() {
            AuthenticationSchemes = "Basic";
        }
    }
}
