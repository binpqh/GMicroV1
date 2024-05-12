namespace AsimKiosk.Contracts.Kiosk.Video;

public class VideoResponse
{
    public string DeviceId { get; set; } = string.Empty;
    public string VideoKey { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
