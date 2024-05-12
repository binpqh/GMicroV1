using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Repositories;
using AsimKiosk.Infrastructure.Persistence.Specifications;
using MongoFramework.Linq;

namespace AsimKiosk.Infrastructure.Persistence.Repositories;

internal class ExternalAPIRepository(IUnitOfWork unitOfWork)
    : GenericRepository<ExternalAPI>(unitOfWork), IExternalAPIRepository
{
    public async Task<bool> IsUrlUnique(string url)
    {
        return !await AnyAsync(new BaseUrlSpecification(url));
    }
   
    public async Task<Maybe<ExternalAPI>> GetAPIAddSimPackageAsync()
        => await UnitOfWork.Set<ExternalAPI>().FirstOrDefaultAsync(eApi=>eApi.NameAPI.ToLower().Contains("simpackage"));

    public async Task<Maybe<ExternalAPI>> GetAPITokenSimAsync()
        => await UnitOfWork.Set<ExternalAPI>().FirstOrDefaultAsync(eApi => eApi.NameAPI.ToLower().Contains("token"));

    public async Task<Maybe<ExternalAPI>> GetAPIListPackageSimAsync()
        => await UnitOfWork.Set<ExternalAPI>().FirstOrDefaultAsync(eApi => eApi.NameAPI.ToLower().Contains("listpackage"));
}
