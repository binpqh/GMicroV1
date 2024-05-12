using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Domain.Repositories
{
    public interface IPaymentRepository
    {
        /// <summary>
        /// Gets the payment with the specified identifier.
        /// </summary>
        /// <param name="paymentId"></param>
        /// <returns>The maybe instance that may contain the payment with the specified identifier.</returns>
        Task<Maybe<Payment>> GetByIdAsync(string paymentId);
        Task<Maybe<Payment>> GetPaymentByTransactionNumberAsync(string transNo);
        Task<Maybe<Payment>> GetPaymentByOrderCodeAsync(string orderCode);
        Task<List<Payment>> GetPaymentsByBankCodeAsync(string? bankCode, DateTime? from, DateTime? to);
        Task<bool> IsPaymentCompletedAsync(string orderCode);
        void Insert(Payment payment);
        Task RemoveAsync(Payment payment);
    }
}
