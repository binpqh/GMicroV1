using System.Text.Json.Serialization;

namespace AsimKiosk.Contracts.LocalSimApi;

public class RegisterSimLocalResponse
{
    [JsonPropertyName("state")]
    public int State { get; set; } = -1;

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;
}