using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Application.Core.Common;

public static class SerialGenerator
{
    public static List<CardStorage> GenerateSIMSerial(string ticketId, int slot, string itemCode, string deviceId, long from, long to)
    {
        List<CardStorage> serials = [];
        if (from == to && from > 0)
        {
            // Single SIM case
            serials.Add(new CardStorage
            {
                SerialNumber = from,
                TicketId = ticketId,
                DeviceId = deviceId,
                ItemCode = itemCode,
                Slot = slot,
            });
        }
        else if (from < to)
        {
            // Range of SIMs case
            for (var i = from; i <= to; i++)
            {
                serials.Add(new CardStorage
                {
                    SerialNumber = i,
                    TicketId = ticketId,
                    DeviceId = deviceId,
                    ItemCode = itemCode,
                    Slot = slot,
                });
            }
        }
        return serials;
    }
}
