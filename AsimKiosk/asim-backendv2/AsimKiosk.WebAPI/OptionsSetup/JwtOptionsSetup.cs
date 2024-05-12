using AsimKiosk.Infrastructure.Common.Authentication;
using Microsoft.Extensions.Options;

namespace AsimKiosk.WebAPI.OptionsSetup
{
    public class JwtOptionsSetup(IConfiguration configuration) : IConfigureOptions<JwtOptions>
    {
        private const string SectionName = "Jwt";

        public void Configure(JwtOptions options)
        {
            configuration.GetSection(SectionName).Bind(options);
        }
    }
}
