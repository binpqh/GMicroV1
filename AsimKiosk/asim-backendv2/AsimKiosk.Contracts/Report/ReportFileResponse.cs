namespace AsimKiosk.Contracts.Report;

public class ReportFileResponse
{
    public Stream Stream { get; set; } = new MemoryStream();
    public string Title { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
}
