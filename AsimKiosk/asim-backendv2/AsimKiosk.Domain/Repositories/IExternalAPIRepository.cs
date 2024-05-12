using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Repositories
{
    public interface IExternalAPIRepository
    {
        /// <summary>
        /// Gets the externalAPI with the specified identifier.
        /// </summary>
        /// <param name="externalAPIId"></param>
        /// <returns>The maybe instance that may contain the externalAPI with the specified identifier.</returns>
        Task<Maybe<ExternalAPI>> GetByIdAsync(string externalAPIId);
        Task<Maybe<ExternalAPI>> GetAPIAddSimPackageAsync();
        Task<Maybe<ExternalAPI>> GetAPITokenSimAsync();
        Task<Maybe<ExternalAPI>> GetAPIListPackageSimAsync();
        Task<Maybe<EntityCollection<ExternalAPI>>> GetAllAsync();
        void Insert(ExternalAPI externalAPI);
        Task RemoveAsync(ExternalAPI externalAPI);
        Task<bool> IsUrlUnique(string url);
    }
}
