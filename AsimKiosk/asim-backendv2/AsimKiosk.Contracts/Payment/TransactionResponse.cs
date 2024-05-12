using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsimKiosk.Contracts.Payment
{
    public class TransactionResponse
    {
        public string ErrorCode { get; set; } = string.Empty;
        public string ErrorMessage { get; set; } = string.Empty;
        public string TechnicalCode { get; set; } = string.Empty;
        public string TechnicalMessage { get; set; } = string.Empty;
        public string TransNo { get; set; } = string.Empty;
        public string OrderNo { get; set; } = string.Empty;
        public long Amount { get; set; }
        public string PartnerCode { get; set; } = string.Empty;
        public string CreatedAt { get; set; } = string.Empty;
        public string PaidAt { get; set; } = string.Empty;
        public string StatusName { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string ApprovalCode { get; set; } = string.Empty;
        public string PartnerStatus { get; set; } = string.Empty;
        public string PartnerTransNo { get; set; } = string.Empty;
    }
}
