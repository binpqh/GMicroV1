using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using Grpc.Core;
using Mapster;
using MongoFramework.Linq;

namespace AsimKiosk.Infrastructure.Persistence.Repositories
{
    internal class MaintenanceRepository(IUnitOfWork unitOfWork) : GenericRepository<Maintenance>(unitOfWork), IMaintenanceRepository
    {
        public async Task<bool> CheckTicket(string deviceId, string errorCode)
        {
            var data = await UnitOfWork.Set<Maintenance>()
                       .Where(e => e.DeviceId == deviceId && e.DeviceErrorCode == errorCode && e.Status == "Active" && e.MaintenanceState == "Pending")
                       .FirstOrDefaultAsync();
            if (data == null) return false;    
            return true;
        }

        public async Task<Maybe<List<Maintenance>>> GetAllAsyncIsNotDelete()
            => await UnitOfWork.Set<Maintenance>()
            .Where(e => e.Status != ActiveStatus.Inactive.ToString())
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
        
        public async Task<Maybe<List<Maintenance>>> GetByGroupIdAsync(string groupId)
            => await UnitOfWork.Set<Maintenance>()
            .Where(m => m.GroupId == groupId && m.Status == ActiveStatus.Active.ToString())
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
    }
}
