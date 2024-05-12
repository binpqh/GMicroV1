using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using AsimKiosk.Domain.ValueObject;
using MongoFramework.Linq;

namespace AsimKiosk.Infrastructure.Persistence.Repositories
{
    internal class PaymentConfigRepository(IUnitOfWork unitOfWork)
        : GenericRepository<PaymentConfig>(unitOfWork), IPaymentConfigRepository
    {
        public async Task<Maybe<PaymentConfig>> GetByChannelKioskAsync()
            => await UnitOfWork.Set<PaymentConfig>().Where(pc=>pc.ChannelCode == "KIOSK").FirstAsync();

        public async Task<bool> IsConfigUniqueWithMerchantCodeAsync(string merchantCode)
            => await UnitOfWork.Set<PaymentConfig>().AnyAsync(pc => pc.MerchantCode == merchantCode && pc.Status != ActiveStatus.Deleted.ToString());

        public async Task<Maybe<PaymentConfig>> GetPaymentConfigActiveAsync() 
            => await UnitOfWork.Set<PaymentConfig>().Where(pc => pc.Status == ActiveStatus.Active.ToString()).FirstOrDefaultAsync();
        
    }
}
