using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.Inventory;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Contracts.Report;

public class OrderReportResponse
{
    public PagedList<ReportOrders> Reports { get; set; } = new PagedList<ReportOrders>([], 0, 0, 0);
    public double TotalPrice { get; set; }
}
public class ReportOrders 
{
    public string DeviceId { get; set; } = string.Empty;
    public string KioskName { get; set; } = string.Empty;
    public string ItemCode { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty; 
    public string OrderCode { get; set; } = string.Empty;
    public string StoreCode { get; set; } = string.Empty; // not used right now
    public int Quantity { get; set; }
    public double Price { get; set; }
    public DateTime CreateAtUTC { get; set; } 
    public string StatusOrder { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
public class InventoryReportResponse
{
    public PagedList<CardDetails> Reports { get; set; } = new PagedList<CardDetails>([], 0, 0, 0);
    public int TotalAmount { get; set; }
    public int ErrorAmount { get; set; }
    public int InStorageAmount { get; set; }
    public int SoldAmount { get; set; }
    public int RegisteredAmount { get; set; }
}
public class CardDetails
{
    public string DeviceId { get; set; } = string.Empty;
    public string KioskName { get; set; } = string.Empty;
    public string GroupName { get; set; } = string.Empty;
    public string ItemCode { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public int Slot { get; set; }
    public string StorageState { get; set; } = string.Empty;
    public DateTime? ModifiedOn { get; set; }
    public DateTime CreatedAt { get; set; }
}