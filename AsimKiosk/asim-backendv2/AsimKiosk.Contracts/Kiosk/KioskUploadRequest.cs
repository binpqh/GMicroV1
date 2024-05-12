using Microsoft.AspNetCore.Http;

namespace AsimKiosk.Contracts.Kiosk;

public class KioskUploadRequest
{
    public string DeviceId { get; set; } = string.Empty;
    public IFormFile VideoFile { get; set; } = null!;
    public int VideoDurationSecond { get; set; }
    public int VideoSize { get; set; }
}
