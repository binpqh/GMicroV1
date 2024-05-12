using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.LogPeripherals;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.LogPeripherals.Queries.GetAll;

public class GetAllLogByIdQueryHandler(ILogPeripherals logPeripherals , IKioskRepository kiosk) : IQueryHandler<GetAllLogByIdQuery, Maybe<List<LogPeripheralsResponse>>>
{
    public async Task<Maybe<List<LogPeripheralsResponse>>> Handle(GetAllLogByIdQuery request, CancellationToken cancellationToken)
    {
        var dataKiosk = await kiosk.GetKioskAndroidIdAsync(request.DeviceId);
        if (dataKiosk.HasNoValue) return Maybe<List<LogPeripheralsResponse>>.None;
        return request.Logtype.ToLower() switch
        {
            "printer" => (Maybe<List<LogPeripheralsResponse>>)logPeripherals.GetAllLogPeripheralsById<Printer>(request.DeviceId,"Printer").Result.Adapt<List<LogPeripheralsResponse>>(),
            "ups" => (Maybe<List<LogPeripheralsResponse>>)logPeripherals.GetAllLogPeripheralsById<Ups>(request.DeviceId, "Ups").Result.Adapt<List<LogPeripheralsResponse>>(),
            "sensor" => (Maybe<List<LogPeripheralsResponse>>)logPeripherals.GetAllLogPeripheralsById<Temperture>(request.DeviceId, "Temperture").Result.Adapt<List<LogPeripheralsResponse>>(),
            _ => Maybe<List<LogPeripheralsResponse>>.None   
        };
    }
}

   
