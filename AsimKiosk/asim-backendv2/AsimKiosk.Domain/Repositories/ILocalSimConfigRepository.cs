using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Repositories;
public interface ILocalSimConfigRepository
{
    Task<Maybe<LocalSimConfig>> GetActiveConfigAsync();
    Task<List<LocalSimConfig>> GetAllConfig();
    Task<Maybe<LocalSimConfig>> GetByIdAsync(string id);
    Task<Maybe<List<LocalSimConfig>>> GetByGroupId(string idGroup);
    void Insert(LocalSimConfig entity);
    Task RemoveAsync(LocalSimConfig entity);

}
