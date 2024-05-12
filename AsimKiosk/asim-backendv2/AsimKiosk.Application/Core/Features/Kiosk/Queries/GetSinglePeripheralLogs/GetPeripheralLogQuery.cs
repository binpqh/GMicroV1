using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk.Peripheral;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Kiosk.Queries.GetSinglePeripheralLogs;

public class GetPeripheralLogQuery(string deviceId, string? peripheralId, DateTime? from, DateTime? to)
    : IQuery<Maybe<List<PeripheralLogResponse>>>
{
    public string DeviceId { get; set; } = deviceId;
    public string? PeripheralId { get; set; } = peripheralId;
    public DateTime? From { get; set; } = from;
    public DateTime? To { get; set; } = to;
}
