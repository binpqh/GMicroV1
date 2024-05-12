using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Events;

public class WarehouseTicketCreatedDomainEvent : IDomainEvent
{
    public WarehouseTicketCreatedDomainEvent(WarehouseTicket ticket)
    {
        Ticket = ticket;
    }
    public WarehouseTicket Ticket { get;}

}
