using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Payment.Hub;
using AsimKiosk.Domain.Core.Primitives;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsimKiosk.Application.Core.Features.Payment.Command.TransactionRedirect
{
    public class TransactionRedirectCommand : ICommand<Result>
    {
        public TransactionRedirectCommand(RedirectRequest request) 
        {
            Amount = request.Amount;
            OrderId = request.OrderId ?? string.Empty;
            PartnerCode = request.PartnerCode ?? string.Empty;
            Signature = request.Signature ?? string.Empty;
            BankCode = request.BankCode ?? string.Empty;
            PaymentMethod = request.PaymentMethod ?? string.Empty;
            PaymentType = request.PaymentType ?? string.Empty;
            ErrorCode = request.ErrorCode;
            Message = request.Message ?? string.Empty;
            TransactionTs = request.TransactionTs ?? string.Empty;
            ExtraData = request.ExtraData ?? string.Empty;
        }
        public long Amount { get; set; }
        public string OrderId { get; set; }
        public string PartnerCode { get; set; }
        public string Signature { get; set; }
        public string BankCode { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentType { get; set; }
        public int ErrorCode { get; set; }
        public string Message { get; set; }
        public string TransactionTs { get; set; }
        public string ExtraData { get; set; }
    }
}
