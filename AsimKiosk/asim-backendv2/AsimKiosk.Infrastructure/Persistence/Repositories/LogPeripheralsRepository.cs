using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Repositories;
using MongoFramework.Linq;

namespace AsimKiosk.Infrastructure.Persistence.Repositories;

internal class LogPeripheralsRepository(IUnitOfWork unitOfWork) : ILogPeripherals
{
    public void Insert<TData>(LogPeripherals<TData> logPeripherals)
    {
        unitOfWork.Set<LogPeripherals<TData>>().Add(logPeripherals);
    }

    public async Task<LogPeripherals<TData>> GetPeripheralsByType<TData>(string deviceId, string type)
    {
        return await unitOfWork.Set<LogPeripherals<TData>>()
            .Where(e => e.DeviceId == deviceId && e.TypeLog == type)
            .OrderByDescending(e => e.CreatedAt)
            .FirstOrDefaultAsync(); 
    }

    public async Task<List<LogPeripherals<TData>>> GetAllLogPeripheralsById<TData>(string deviceId, string type)
    {
        return await unitOfWork.Set<LogPeripherals<TData>>()
              .Where(e => e.DeviceId == deviceId && e.TypeLog == type)
              .OrderByDescending(e => e.CreatedAt)
              .Take(20)
              .ToListAsync();
    }
}
