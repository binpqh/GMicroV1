using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Common;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Contracts.LogAPI;
using AsimKiosk.Contracts.Order;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.AsimLog.Queries.GetApiLog;

public class GetApiLogQueryHandler(
    ILogRepository logRepository,
    IKioskRepository kioskRepository)
    : IQueryHandler<GetApiLogQuery, Maybe<PagedList<LogApiResponse>>>
{
    public async Task<Maybe<PagedList<LogApiResponse>>> Handle(GetApiLogQuery request, CancellationToken cancellationToken)
    {
        var kiosk = await kioskRepository.GetKioskAndroidIdAsync(request.DeviceId);

        if (kiosk.HasNoValue)
        {
            return Maybe<PagedList<LogApiResponse>>.None;
        }

        var logs = await logRepository.GetAllAsync(request.DeviceId, request.From, request.To);
        var response = logs.Value.Entities
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .OrderByDescending(e => e.CreatedAt)
            .Adapt<List<LogApiResponse>>();

        return new PagedList<LogApiResponse>(response, response.Count, request.Page, request.PageSize);
    }
}
