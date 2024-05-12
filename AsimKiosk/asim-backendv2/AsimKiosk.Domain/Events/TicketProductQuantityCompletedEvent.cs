using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Entities;
using System.Net.Sockets;

namespace AsimKiosk.Domain.Events;

public class TicketProductQuantityCompletedEvent(WarehouseTicket ticket, int slot) : IDomainEvent
{
    public WarehouseTicket Ticket { get; set; } = ticket;
    public int Slot { get; set; } = slot;
}
