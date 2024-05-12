using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.AsimLog.Queries.GetKioskLogs;

internal class GetKioskLogsQueryHandler(IUserIdentifierProvider userIdentifierProvider,
    IKioskRepository kioskRepository,
    IGroupRepository groupRepository,
    ILogRepository logRepository) : IQueryHandler<GetKioskLogsQuery, Maybe<PagedList<KioskLogResponse>>>
{
    public async Task<Maybe<PagedList<KioskLogResponse>>> Handle(GetKioskLogsQuery request, CancellationToken cancellationToken)
    {
        if (userIdentifierProvider.Role == UserRole.Administrator.ToString() || userIdentifierProvider.Role == UserRole.Superman.ToString())
        {
            (var kiosks, int total) = await kioskRepository.GetPaginateAsync(request.PageSize,request.PageNumber, null);
            return new PagedList<KioskLogResponse>(kiosks.Select(k=> new KioskLogResponse
            {
                DeviceId = k.DeviceId,
                KioskName = k.KioskName,
                GroupName = string.IsNullOrEmpty(k.GroupId) ? "" : groupRepository.GetGroupNameById(k.GroupId),
                NumberOfLogs = logRepository.CountByKiosk(k.DeviceId)
            }), total, request.PageNumber, request.PageSize);
        }
        else
        {
            (var kiosks, int total) = await kioskRepository.GetPaginateAsync(request.PageSize, request.PageNumber, userIdentifierProvider.GroupId);
            return new PagedList<KioskLogResponse>(kiosks.Select(k => new KioskLogResponse
            {
                DeviceId = k.DeviceId,
                KioskName = k.KioskName,
                GroupName = string.IsNullOrEmpty(k.GroupId) ? "" : groupRepository.GetGroupNameById(k.GroupId),
                NumberOfLogs = logRepository.CountByKiosk(k.DeviceId)
            }), total, request.PageNumber, request.PageSize);
        }
    }
}
