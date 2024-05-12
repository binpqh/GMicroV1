using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Repositories;
using MongoFramework.Linq;

namespace AsimKiosk.Infrastructure.Persistence.Repositories;

internal class LogRepository(IUnitOfWork unitOfWork) : GenericRepository<Log>(unitOfWork), ILogRepository
{
    public async Task<int> CountAllAysnc()
        => await UnitOfWork.Set<Log>().CountAsync();

    public int CountByKiosk(string deviceId)
        => UnitOfWork.Set<Log>().Count(l => l.DeviceId == deviceId);

    public async Task<Maybe<EntityCollection<Log>>> GetAllAsync(string deviceId, DateTime from, DateTime to)
    {
        var logs = await UnitOfWork.Set<Log>()
            .Where(e => e.DeviceId == deviceId)
            .Where(e => e.CreatedAt >= from)
            .Where(e => e.CreatedAt <= to)
            .ToListAsync();
        var res = Maybe<EntityCollection<Log>>.From(new EntityCollection<Log>(logs));
        return res;
    }

    public async Task<(List<Log>,int)> GetPaginateAllByKioskAsync(string deviceId, int pageSize, int pageNumber, DateTime from, DateTime to)
    {
        var logs = UnitOfWork.Set<Log>().Where(l => l.DeviceId == deviceId)
                                          .Where(l => l.CreatedAt >= from)
                                          .Where(l => l.CreatedAt <= to).AsQueryable();
        var res = await logs.Skip((pageNumber - 1) * pageSize)
                                          .Take(pageSize).ToListAsync();
        return (res, logs.Count());
    }

    public async Task<Maybe<Log>> GetSameIssueAsync(string urlApi, string jsonData)
        => await UnitOfWork.Set<Log>().Where(l => l.UrlAPI == urlApi && l.JsonData == jsonData).FirstOrDefaultAsync();
}