using System.Text.Json.Serialization;

namespace AsimKiosk.Contracts.LocalSimApi;
public class GetTokenRequest
{
    public string UserName { get; set; } = "vendertest@asimgroup.vn"; // username
    public string Password { get; set; } = "Asim@2023";// password
    public string GrantType { get; set; } = "password"; // grant_type
    public string ClientId { get; set; } = "vender-tgdd"; // client_id
    public string ClientSecret { get; set; } = "3cfece07-4371-4f96-8a29-3cd80a230f7d"; // client_secret
    public string Scope { get; set; } = "openid"; // scope
    public string Realm { get; set; } = "LocalShop"; // realm
};

public class GetTokenResponse
{
    [JsonPropertyName("access_token")]
    public required string AccessToken { get; set; }

    [JsonPropertyName("expires_in")]
    public long ExpiresIn { get; set; }

    [JsonPropertyName("refresh_expires_in")]
    public long RefreshExpiresIn { get; set; }


    [JsonPropertyName("refresh_token")]
    public required string RefreshToken { get; set; }


    [JsonPropertyName("token_type")]
    public required string TokenType { get; set; }

    [JsonPropertyName("id_token")]
    public required string TokenId { get; set; }


    [JsonPropertyName("scope")]
    public required string Scope { get; set; }

    [JsonPropertyName("session_state")]
    public required string SessionState { get; set; }

    [JsonPropertyName("not-before-policy")]
    public int NotBeforePolicy { get; set; }
}