using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Repositories
{
    public interface IMaintenanceRepository
    {
        Task<Maybe<EntityCollection<Maintenance>>> GetAllAsync();
        Task<Maybe<List<Maintenance>>> GetAllAsyncIsNotDelete();
        Task<Maybe<Maintenance>> GetByIdAsync(string idTicket);
        Task<Maybe<List<Maintenance>>> GetByGroupIdAsync(string groupId);
        void Insert(Maintenance maintenance);
        Task<bool> CheckTicket(string deviceId ,string errorCode);
        Task RemoveAsync(Maintenance maintenance);
    }
}
