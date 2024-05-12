using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.LogPeripherals;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.LogPeripherals.Queries.GetAll;

public class GetAllLogByIdQuery(string deviceId, string logtype) : IQuery<Maybe<List<LogPeripheralsResponse>>>
{
    public string Logtype = logtype;
    public string DeviceId = deviceId;
}
