using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Contracts.Report;

public class ReportRequest 
{
    public List<string> ItemCode { get; set; } = [];
    public string? PaymentMethod { get; set; }
    public List<string> DeviceIds { get; set; } = [];
    public OrderStatus OrderStatus { get; set; }
    public string From { get; set; } = string.Empty;
    public string To { get; set; } = string.Empty;
}

public class InventoryReportRequest
{
    public string ProductCode { get; set; } = string.Empty;
    public List<string> ItemCode { get; set; } = [];
    public List<string> DeviceIds { get; set; } = [];
    public StorageStatus StorageStatus { get; set; }
}