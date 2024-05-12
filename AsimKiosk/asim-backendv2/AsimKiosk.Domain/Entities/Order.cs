using AsimKiosk.Domain.Core.Abstractions;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Events;
using AsimKiosk.Domain.ValueObject;
using System.Security.Policy;

namespace AsimKiosk.Domain.Entities;

public class Order : AggregateRoot, ISoftDeletableEntity
{
    public string DeviceId { get; set; } = null!;
    public string KioskName { get; set; } = string.Empty;
    public string GroupName { get; set; } = string.Empty;
    public string ItemCode { get; set; } = null!;
    public string OrderCode { get; set; } = null!;
    public string OrderId { get; set; } = string.Empty; //required property in payment hub
    public int Quantity { get; set; }
    public double TotalMountVND { get; set; }
    public int RatingPoint { get; set; }
    public List<string> SerialNumber { get; set; } = new();
    public List<string> ErrorSerialNumber { get; set; } = new();
    public int ErrorCards { get; set; }
    public string StatusOrder { get; set; } = OrderStatus.Processing.ToString();
    public string PaymentStatus { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public List<OrderLog> LogProcessOrder { get; set; } = new();
    public DateTime CreateAtUTC { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedOn { get; set;}
    public DateTime? CompleteOn { get; set; } 
    public string Status { get; set; } = ActiveStatus.Active.ToString();

    public static void UpdateInventory(Order order, Dictionary<int, List<string>> errorDictionary) 
    {
        order.AddDomainEvent(new OrderCompletedEvent(order, errorDictionary));
    }
}
