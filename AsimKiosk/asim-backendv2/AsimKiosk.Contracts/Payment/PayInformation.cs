using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsimKiosk.Contracts.Payment
{
    public class CheckPayRequest
    {
        public string Terminal { get; set; } = string.Empty;
        public string Key { get; set; } = string.Empty;
        public string OrderId { get; set; } = string.Empty;
        public string DeviceId { get; set; } = string.Empty;
        public string Signature { get; set; } = string.Empty;
        public long TotalAmount { get; set; }
        public string OrderCode { get; set; } = string.Empty;
        public string TransNo { get; set; } = string.Empty;
        public string Channel { get; set; } = string.Empty;
        public string Partner { get; set; } = string.Empty;
        public string Product { get; set; } = string.Empty;
        public string Merchant { get; set; } = string.Empty;
        public string ClientIp { get; set; } = string.Empty;
    }


}
