using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Repositories;

public interface ILogPeripherals
{
    void Insert<TData>(LogPeripherals<TData> logPeripherals);
    Task<LogPeripherals<TData>> GetPeripheralsByType<TData>(string deviceId, string type);
    Task<List<LogPeripherals<TData>>> GetAllLogPeripheralsById<TData>(string deviceId, string type);
}

