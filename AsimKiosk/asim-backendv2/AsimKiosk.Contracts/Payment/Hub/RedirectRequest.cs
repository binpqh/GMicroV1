using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsimKiosk.Contracts.Payment.Hub
{
    public class RedirectRequest
    {
        public long Amount { get; set; }
        public string? OrderId { get; set; }
        public string? PartnerCode { get; set; }
        public string? Signature { get; set; }
        public string? BankCode { get; set; }
        public string? PaymentMethod { get; set; }
        public string? PaymentType { get; set; }
        public int ErrorCode { get; set; }
        public string? Message { get; set; }
        public string? TransactionTs { get; set; }
        public string? ExtraData { get; set; }
    }
}
