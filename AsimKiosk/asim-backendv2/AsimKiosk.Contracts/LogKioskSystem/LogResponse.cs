namespace AsimKiosk.Contracts.LogKioskSystem;

public class LogResponse
{
    public string DeviceId { get; set; } = string.Empty;
    public string KioskName { get; set; } = string.Empty;
    public string GroupName { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string UrlAPI { get; set; } = string.Empty;
    public string JsonData { get; set; } = string.Empty;
    public string Desc { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
