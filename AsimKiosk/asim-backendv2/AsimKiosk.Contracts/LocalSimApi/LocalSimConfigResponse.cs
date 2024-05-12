using AsimKiosk.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsimKiosk.Contracts.LocalSimApi;

public class LocalSimConfigResponse
{
    public string Id { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string GrantType { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string Scope { get; set; } = string.Empty;
    public string Realm { get; set; } = string.Empty;
    public string AuthUrl { get; set; } = string.Empty;
    public string BussUrl { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
