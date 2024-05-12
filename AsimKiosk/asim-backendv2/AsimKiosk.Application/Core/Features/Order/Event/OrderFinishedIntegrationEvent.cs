using AsimKiosk.Application.Core.Abstractions.Notification;
using AsimKiosk.Domain.Events;

namespace AsimKiosk.Application.Core.Features.Order.Event;

public class OrderFinishedIntegrationEvent : IIntegrationEvent
{
    internal OrderFinishedIntegrationEvent(OrderCompletedEvent completedEvent)
    {
        OrderCode = completedEvent.Order.OrderCode;
        ItemCode = completedEvent.Order.ItemCode;
        DeviceId = completedEvent.Order.DeviceId;
    }
    public string OrderCode { get; set; }
    public string ItemCode { get; set; }
    public string DeviceId { get; set; }
}
