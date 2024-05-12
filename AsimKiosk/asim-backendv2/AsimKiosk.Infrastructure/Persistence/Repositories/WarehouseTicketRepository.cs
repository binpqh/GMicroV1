using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using MongoFramework.Linq;

namespace AsimKiosk.Infrastructure.Persistence.Repositories;

internal class WarehouseTicketRepository(IUnitOfWork unitOfWork) : GenericRepository<WarehouseTicket>(unitOfWork), IWarehouseTicketRepository
{
    public async Task<List<WarehouseTicket>> GetTicketsByDeviceId(string deviceId)
     => await UnitOfWork.Set<WarehouseTicket>()
        .Where(k => k.DeviceId == deviceId)
        .OrderByDescending(k => k.CreatedAt)
        .ToListAsync();

    public async Task<int> GetSlotBySerialNumber(string deviceId, long serialNumber)
    => await UnitOfWork.Set<WarehouseTicket>()
        .Where(ticket => ticket.DeviceId == deviceId &&
               ticket.ProductQuantities.Any(pq => serialNumber >= pq.From && serialNumber <= pq.To))
        .SelectMany(ticket => ticket.ProductQuantities)
        .Where(pq => serialNumber >= pq.From && serialNumber <= pq.To)
        .Select(pq => pq.DispenserSlot)
        .FirstOrDefaultAsync();

    public async Task<Maybe<WarehouseTicket>> GetNewestTicketId(string groupId)
        => await UnitOfWork.Set<WarehouseTicket>().OrderBy(ticket => ticket.CreatedAt).Where(ticket => ticket.GroupId == groupId && ticket.Status == ActiveStatus.Active.ToString()).FirstOrDefaultAsync();

    public async Task<bool> CheckExistsAsync(string deviceId, string creator, TicketType ticketType)
    {
        var existingTicket = await UnitOfWork.Set<WarehouseTicket>()
        .AnyAsync(e => e.DeviceId == deviceId &&
            e.CreatorId == creator &&
            e.Type == ticketType.ToString() && e.CompletionProgress == 0);

        return existingTicket;
    }
}
