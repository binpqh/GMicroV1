using Newtonsoft.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace AsimKiosk.Contracts.LogAPI;

public class LogAPIRequest
{
    public string ErrorCodeFromServer { get; set; } = string.Empty;
    public string UrlAPI { get; set; } = string.Empty;
    [JsonProperty]
    public string JsonData { get; set; } = string.Empty;
    public string Desc { get; set; } = string.Empty;
}
