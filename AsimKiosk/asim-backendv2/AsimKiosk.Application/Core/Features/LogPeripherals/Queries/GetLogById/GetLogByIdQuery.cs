using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.LogPeripherals;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Application.Core.Features.LogPeripherals.Queries.GetLogById;

public class GetLogByIdQuery(string deviceId, string logtype) : IQuery<Maybe<LogPeripheralsResponse>>
{
    public string Logtype = logtype;
    public string DeviceId = deviceId;
}
