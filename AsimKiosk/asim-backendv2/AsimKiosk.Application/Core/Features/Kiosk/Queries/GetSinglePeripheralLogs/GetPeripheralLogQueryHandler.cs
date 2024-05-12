using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Contracts.Kiosk.Peripheral;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using AsimKiosk.Domain.ValueObject;
using Mapster;
using System.Security.Claims;

namespace AsimKiosk.Application.Core.Features.Kiosk.Queries.GetSinglePeripheralLogs;

public class GetPeripheralLogQueryHandler(
    IKioskRepository kioskRepository,
    IUserIdentifierProvider userIdentifierProvider)
    : IQueryHandler<GetPeripheralLogQuery, Maybe<List<PeripheralLogResponse>>>
{
    public async Task<Maybe<List<PeripheralLogResponse>>> Handle(GetPeripheralLogQuery request, CancellationToken cancellationToken)
    {
        var userRole = userIdentifierProvider.Role;
        var groupId = userIdentifierProvider.GroupId;

        var kiosk = await kioskRepository.GetKioskAndroidIdAsync(request.DeviceId);

        if (kiosk.HasNoValue || userRole == null || !string.IsNullOrWhiteSpace(groupId) && groupId != kiosk.Value.GroupId)
        {
            return Maybe<List<PeripheralLogResponse>>.None;
        }

        var logs = new List<PeripheralLogResponse>();

        if (request.PeripheralId != null)
        {
            var peripheral = kiosk.Value.Peripherals.FirstOrDefault(p => p.Id == request.PeripheralId);
            if (peripheral == null)
            {
                return Maybe<List<PeripheralLogResponse>>.None;
            }
            logs = peripheral.HistoryPeripherals
                .Where(p => (request.From == null || p.CreatedAt > request.From) &&
                            (request.To == null || p.CreatedAt < request.To))
                .Adapt<List<PeripheralLogResponse>>();

            return logs;
        }
        var histories = kiosk.Value.Peripherals.SelectMany(p => p.HistoryPeripherals).ToList();
        logs = histories
            .Where(p => (request.From == null || p.CreatedAt > request.From) &&
                            (request.To == null || p.CreatedAt < request.To))
            .Adapt<List<PeripheralLogResponse>>();

        return logs;
        
    }
}
