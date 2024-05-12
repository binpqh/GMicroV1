using System.Text.Json.Serialization;

namespace AsimKiosk.Contracts.LocalSimApi;

public class GetPackageRespone
{
    [JsonPropertyName("code")]
    public required string Code { get; set; }
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    [JsonPropertyName("note")]
    public string Note { get; set; } = string.Empty;

}