namespace AsimKiosk.Contracts.Report;

public class ReportFileRequest
{
    public Stream Stream { get; set; } = new MemoryStream();
    public string Title { get; set; } = string.Empty;
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public List<ReportOrders> RowData { get; set; } = [];
}
