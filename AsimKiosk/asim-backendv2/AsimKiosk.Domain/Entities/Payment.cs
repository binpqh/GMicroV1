using AsimKiosk.Domain.Core.Abstractions;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace AsimKiosk.Domain.Entities
{
    [Table("Payment")]
    public class Payment(
        string payConfigId,
        string orderCode,
        string partnerCode,
        string terminalCode,
        string productBankCode,
        string? bankCode)
        : AggregateRoot, ISoftDeletableEntity
    {
        public string OrderCode { get; set; } = orderCode;
        public string PartnerCode { get; set; } = partnerCode;
        public string ProductCode { get; set; } = productBankCode;
        public string? BankCode { get; set; } = bankCode;
        public string TerminalCode { get; set; } = terminalCode;
        public string PaymentConfigId { get; set; } = payConfigId;
        public string TransactionNumber { get; set; } = string.Empty;
        public string TokenInformation { get; set; } = string.Empty;
        public string Signature { get; set; } = string.Empty;
        public string RequestId { get; set; } = string.Empty;
        public string ClientIp { get; set; } = string.Empty;
        public string State { get; set; } = PaymentStatus.Processing.ToString();
        public string Status { get; set; } = ActiveStatus.Active.ToString();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? FinishedAt { get; set; }
        public DateTime? DeletedOn { get; set; }
    }
}
