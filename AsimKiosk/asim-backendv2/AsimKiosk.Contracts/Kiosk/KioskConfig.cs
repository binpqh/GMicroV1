using AsimKiosk.Domain.Enums;
using Newtonsoft.Json;

namespace AsimKiosk.Contracts.Kiosk
{
    public class KioskConfigResponse
    {
        public KioskConfigResponse(string kioskService, KioskPaymentMethod[]? paymentTypeAvailables)
        {
            KioskService = kioskService;
            PaymentTypeAvailables = paymentTypeAvailables ?? new KioskPaymentMethod[0];
        }
        public string KioskService { get; set; }
        public KioskPaymentMethod[]? PaymentTypeAvailables { get; set; }
        public class KioskPaymentMethod
        {
            public string ProductCode { get; set; } = string.Empty;
            public string ProductName { get; set; } = string.Empty;
            public BankCode[] BankCodes { get; set; } = new BankCode[0];

            public class BankCode
            {
                public string Code { get; set; } = string.Empty;
                public string Name { get; set; } = string.Empty;
                public string Icon { get; set; } = string.Empty;
            }
        }
    }
    public class KioskRegisterRequest
    {
        public KioskRegisterRequest(string deviceId)
        {
            DeviceId = deviceId;
        }
        public string DeviceId { get; set; } = null!;
    }
    public class KioskAddSimPackageRequest
    {
        public string SerialSim { get; set; } = string.Empty;
        public string OrderCode { get; set; } = string.Empty;
        // public string Packet { get; set; } = string.Empty;
    }
}