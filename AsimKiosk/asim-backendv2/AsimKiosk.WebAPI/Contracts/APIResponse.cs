namespace AsimKiosk.WebAPI.Contracts;

/// <summary>
/// Represents API an error response.
/// </summary>
public class APIResponse
{
    public APIResponse(object data)
    {
        Data = data;
    }
    public APIResponse()
    {
    }
    public bool Status { get; } = true;
    public string? Message { get; set; } = null;
    public object? Data { get; set; }
}