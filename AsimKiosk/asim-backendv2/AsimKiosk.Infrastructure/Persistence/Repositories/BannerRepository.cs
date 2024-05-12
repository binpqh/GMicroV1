using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using MongoFramework.Linq;

namespace AsimKiosk.Infrastructure.Persistence.Repositories;

internal class BannerRepository(IUnitOfWork unitOfWork) : GenericRepository<Banner>(unitOfWork), IBannerRepository
{
    public async Task<IEnumerable<Banner>> GetAllActiveAsync()
    {
        return await UnitOfWork.Set<Banner>()
            .Where(e => e.Status == ActiveStatus.Active.ToString())
            .ToArrayAsync();
    }
    public async Task<IEnumerable<Banner>> GetAllNotDeteledAsync()
    {
        return await UnitOfWork.Set<Banner>()
            .Where(e => e.Status != ActiveStatus.Deleted.ToString())
            .ToArrayAsync();
    }

    public async Task<Maybe<Banner>> GetByImageKeyAsync(string imageKey)
        => await UnitOfWork.Set<Banner>().FirstOrDefaultAsync(b => b.ImageKey == imageKey);

    public async Task<int> GetLastIndexPriorityAsync()
    {
        try
        {
            return await UnitOfWork.Set<Banner>().MaxAsync(b => b.Priority);
        }
        catch
        {
            return 0;
        }
    }
}
