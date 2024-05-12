using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Contracts.Payment
{
    public class CheckOrderRequest
    {
        public int Quantity { get; set; }
        public string ItemCode { get; set; } = string.Empty;
        public string OrderCode { get; set; } = string.Empty;
        public string DeviceId { get; set; } = string.Empty;

    }
}
