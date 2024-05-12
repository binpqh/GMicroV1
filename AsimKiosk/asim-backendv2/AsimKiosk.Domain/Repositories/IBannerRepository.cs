using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Repositories;

public interface IBannerRepository 
{
    Task<Maybe<Banner>> GetByIdAsync(string id);
    Task<Maybe<EntityCollection<Banner>>> GetAllAsync();
    Task<IEnumerable<Banner>> GetAllActiveAsync();
    Task<IEnumerable<Banner>> GetAllNotDeteledAsync();
    Task<Maybe<Banner>> GetByImageKeyAsync(string imageKey);
    Task<int> GetLastIndexPriorityAsync();
    void Insert(Banner banner);
    void InsertRange(IReadOnlyCollection<Banner> entities);
    Task RemoveAsync(Banner banner);
}
