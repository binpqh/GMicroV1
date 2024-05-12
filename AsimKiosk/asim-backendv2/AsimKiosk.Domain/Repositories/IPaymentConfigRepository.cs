using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.ValueObject;

namespace AsimKiosk.Domain.Repositories
{
    public interface IPaymentConfigRepository
    {
        /// <summary>
        /// Gets the paymentConfig with the specified identifier.
        /// </summary>
        /// <param name="paymentConfigId"></param>
        /// <returns>The maybe instance that may contain the paymentConfig with the specified identifier.</returns>
        Task<Maybe<EntityCollection<PaymentConfig>>> GetAllAsync();
        Task<Maybe<PaymentConfig>> GetByIdAsync(string paymentConfigId);
        Task<Maybe<PaymentConfig>> GetByChannelKioskAsync();
        Task<bool> IsConfigUniqueWithMerchantCodeAsync(string merchantCode);
        Task<Maybe<PaymentConfig>> GetPaymentConfigActiveAsync();
        void Insert(PaymentConfig paymentConfig);
       
        Task RemoveAsync(PaymentConfig paymentConfig);
    }
}
