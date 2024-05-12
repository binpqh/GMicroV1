using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.ValueObject;

namespace AsimKiosk.Contracts.Order;

public class OrderResponse
{
    public string DeviceId { get; set; } = null!;
    public string ItemCode { get; set; } = null!;
    public string OrderCode { get; set; } = null!;
    public double TotalMountVND { get; set; }
    public int Quantity { get; set; }
    public string Status { get; set; } = ActiveStatus.Active.ToString();
}
public class OrderDropdownResponse
{
    public string OrderCode { get; set; } = string.Empty;
    public string StatusOrder { get; set; } = string.Empty;
    public double TotalMountVND { get; set; }
    public DateTime CreateAtUTC { get; set; }
}
public class OrderDetailResponse
{
    public string DeviceId { get; set; } = string.Empty;
    public string KioskName { get; set; } = string.Empty;
    public string GroupName { get; set; } = string.Empty;
    public string ItemCode { get; set; } = string.Empty;
    public string OrderCode { get; set; } = string.Empty;  
    public string StoreCode { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string ItemName { get; set; } = string.Empty;
    public string OrderId { get; set; } = string.Empty; //required property in payment hub
    public string PaymentMethod { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public double TotalMountVND { get; set; }
    public int RatingPoint { get; set; }
    public List<string> SerialNumber { get; set; } = new();
    public List<string> ErrorSerialNumber { get; set; } = new();
    public int ErrorCards { get; set; }
    public List<OrderLog> LogProcessOrder { get; set; } = new();
    public List<OrderItem> OrderItems { get; set; } = new();
    public string PaymentStatus { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;
    public string PaymentDate { get; set; } = string.Empty;
    public string StatusOrder { get; set; } = OrderStatus.Processing.ToString();
    public string Status { get; set; } = ActiveStatus.Active.ToString();
}
public class OrderItem
{
    public string ProductName { get; set; } = string.Empty;
    public double Price { get; set; }
}
