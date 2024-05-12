

using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Contracts.PaymentConfigure
{
    public class ChangeStatusPaymentConfigRequest
    {
        public string PaymentConfigId { get; set; } = null!;

        public ActiveStatus Status { get; set; }
    }
}
