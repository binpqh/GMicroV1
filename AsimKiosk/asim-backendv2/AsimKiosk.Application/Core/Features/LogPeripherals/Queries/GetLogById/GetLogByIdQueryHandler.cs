using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.LogPeripherals;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.LogPeripherals.Queries.GetLogById;
public class GetLogByIdQueryHandler(ILogPeripherals logPeripherals, IKioskRepository kiosk) : IQueryHandler<GetLogByIdQuery, Maybe<LogPeripheralsResponse>>
{

    public async Task<Maybe<LogPeripheralsResponse>> Handle(GetLogByIdQuery request, CancellationToken cancellationToken)
    {
        var datakiosk = await kiosk.GetActiveKioskByAndroidIdAsync(request.DeviceId);
        if (datakiosk.HasNoValue) return Maybe<LogPeripheralsResponse>.None;
        return request.Logtype.ToLower() switch
        {
            "printer" => (Maybe<LogPeripheralsResponse>)logPeripherals.GetPeripheralsByType<Printer>(request.DeviceId, request.Logtype).Result.Adapt<LogPeripheralsResponse>(),
            "ups" => (Maybe<LogPeripheralsResponse>)logPeripherals.GetPeripheralsByType<Ups>(request.DeviceId, request.Logtype).Result.Adapt<LogPeripheralsResponse>(),
            "temperture" => (Maybe<LogPeripheralsResponse>)logPeripherals.GetPeripheralsByType<Temperture>(request.DeviceId, request.Logtype).Result.Adapt<LogPeripheralsResponse>(),
            _ => Maybe<LogPeripheralsResponse>.None,
        };
    }
}


