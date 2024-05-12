using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using MongoFramework.Linq;

namespace AsimKiosk.Infrastructure.Persistence.Repositories;

internal class CardStorageRepository(IUnitOfWork unitOfWork) : GenericRepository<CardStorage>(unitOfWork), ICardStorageRepository
{
    public async Task<Maybe<CardStorage>> GetByDeviceIdAndSerialCardAsync(string deviceId, long serialCard)
        => await UnitOfWork.Set<CardStorage>()
            .FirstOrDefaultAsync(cs => 
                cs.DeviceId == deviceId && 
                cs.SerialNumber == serialCard &&
                cs.Status == ActiveStatus.Active.ToString());
    public async Task<List<CardStorage>> GetByKioskAsync(string kioskId, DateTime? from, DateTime? to)
    {
        var query = UnitOfWork.Set<CardStorage>().AsQueryable();

        if(from.HasValue && to.HasValue) query = query.Where(c => c.CreatedAt >= from.Value && c.CreatedAt <= to.Value);

        var result = await query.Where(c => c.DeviceId == kioskId).OrderByDescending(c => c.CreatedAt).ToListAsync();

        return result;
    }

    public (int, int, int, int, int) GetInventoryNumbers(List<string> itemCodes, List<string> deviceIds)
    {
        var query = UnitOfWork.Set<CardStorage>().AsQueryable();

        if (itemCodes.Count > 0) query = query.Where(c => itemCodes.Contains(c.ItemCode));

        if (deviceIds.Count > 0) query = query.Where(c => deviceIds.Contains(c.DeviceId));

        var totalCount = query.Count();
        var errorCount = query.Where(c => c.StorageState == StorageStatus.Error.ToString()).Count();
        var inStorageCount = query.Where(c => c.StorageState == StorageStatus.InStorage.ToString()).Count();
        var soldCount = query.Where(c => c.StorageState == StorageStatus.Sold.ToString()).Count();
        var registeredCount = query.Where(c => c.StorageState == StorageStatus.Registered.ToString()).Count();

        return (totalCount, errorCount, inStorageCount, soldCount, registeredCount);
    }

    public async Task<(List<CardStorage>, int)> GetInventoryReportAsync(
        int page, int pageSize, List<string> itemCodes, List<string> deviceIds, StorageStatus status)
    {
        var query = UnitOfWork.Set<CardStorage>().AsQueryable();

        if (itemCodes.Count > 0) query = query.Where(c => itemCodes.Contains(c.ItemCode));
        
        if (deviceIds.Count > 0) query = query.Where(c => deviceIds.Contains(c.DeviceId));

        if (status != StorageStatus.All) query = query.Where(c => c.StorageState == status.ToString());

        var results = await query.ToListAsync();
        var totalCount = results.Count;
        var response = results.OrderByDescending(c => c.CreatedAt).Skip(page - 1).Take(pageSize).ToList();

        return (response, totalCount);
    }
}
