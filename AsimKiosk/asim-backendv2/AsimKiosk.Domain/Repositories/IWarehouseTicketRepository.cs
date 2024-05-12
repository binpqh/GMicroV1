using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Domain.Repositories;

public interface IWarehouseTicketRepository
{
    Task<Maybe<EntityCollection<WarehouseTicket>>> GetAllAsync();
    Task<Maybe<WarehouseTicket>> GetByIdAsync(string id);
    Task<List<WarehouseTicket>> GetTicketsByDeviceId(string deviceId);
    Task<Maybe<WarehouseTicket>> GetNewestTicketId(string groupId);
    Task<int> GetSlotBySerialNumber(string deviceId, long serialNumber);
    void Insert(WarehouseTicket ticket);
    Task RemoveAsync(WarehouseTicket ticket);

    Task<bool> CheckExistsAsync(string deviceId, string creator, TicketType ticketType);
}
