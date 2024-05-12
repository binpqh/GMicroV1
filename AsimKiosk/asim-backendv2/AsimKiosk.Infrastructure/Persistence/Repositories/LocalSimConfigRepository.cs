using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using Grpc.Core;
using MongoFramework.Linq;

namespace AsimKiosk.Infrastructure.Persistence.Repositories;
internal class LocalSimConfigRepository(IUnitOfWork unitOfWork) : GenericRepository<LocalSimConfig>(unitOfWork), ILocalSimConfigRepository
{
    public async Task<Maybe<LocalSimConfig>> GetActiveConfigAsync()
        => await UnitOfWork.Set<LocalSimConfig>()
            .FirstOrDefaultAsync(e => e.Status == ActiveStatus.Active.ToString());

    public async Task<Maybe<List<LocalSimConfig>>> GetByGroupId(string idGroud)
       => await UnitOfWork.Query<LocalSimConfig>()
        .Where(e => e.GroupId == idGroud).ToListAsync();
    public async Task<List<LocalSimConfig>> GetAllConfig()
        => await UnitOfWork.Query<LocalSimConfig>()
        .Where(e => e.Status != ActiveStatus.Deleted.ToString())
        .ToListAsync();
}