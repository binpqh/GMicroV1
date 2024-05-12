using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Repositories;

public interface ILogRepository
{
    Task<Maybe<EntityCollection<Log>>> GetAllAsync();
    Task<Maybe<EntityCollection<Log>>> GetAllAsync(string deviceId, DateTime from, DateTime to);
    Task<(List<Log>, int)> GetPaginateAllByKioskAsync(string deviceId, int pageSize, int pageNumber,DateTime from, DateTime to);
    Task<Maybe<Log>> GetSameIssueAsync(string urlAPI, string jsonData);
    Task<int> CountAllAysnc();
    int CountByKiosk(string deviceId);
    void Insert(Log log);
    Task RemoveAsync(Log log);
}
