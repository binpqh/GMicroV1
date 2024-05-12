using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using MongoFramework.Linq;

namespace AsimKiosk.Infrastructure.Persistence.Repositories;

internal class PaymentRepository(IUnitOfWork unitOfWork) : GenericRepository<Payment>(unitOfWork), IPaymentRepository
{
    public async Task<Maybe<Payment>> GetPaymentByOrderCodeAsync(string orderCode)
        => await UnitOfWork.Set<Payment>().Where(p => p.OrderCode == orderCode).FirstOrDefaultAsync();


    public async Task<Maybe<Payment>> GetPaymentByTransactionNumberAsync(string transNo)
        => await UnitOfWork.Set<Payment>().Where(p => p.TransactionNumber == transNo).FirstAsync();

    public async Task<bool> IsPaymentCompletedAsync(string orderCode)
        => await UnitOfWork.Set<Payment>().AnyAsync(p => p.OrderCode == orderCode && p.State == PaymentStatus.Success.ToString());

    public async Task<List<Payment>> GetPaymentsByBankCodeAsync(string? bankCode, DateTime? from, DateTime? to)
    {
        var query = UnitOfWork.Set<Payment>().AsQueryable();

        if (bankCode != null)
        {
            query = query.Where(o => o.BankCode == bankCode);
        }
        else 
        {
            query = query.Where(o => o.BankCode == null);
        }

        if (from is not null && to is not null) query = query.Where(o => o.CreatedAt >= from && o.CreatedAt <= to);

        query = query.Where(o => o.Status != ActiveStatus.Deleted.ToString());

        var response = await query.ToListAsync();
        return response;
    }
}
