using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Features.AsimLog.Queries.GetLogsByKiosk;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.LogKioskSystem;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.AsimLog.Queries.GetLogs;

internal class GetLogsQueryHandler(IUserIdentifierProvider identifierProvider,IKioskRepository kioskRepository, ILogRepository logRepository, IGroupRepository groupRepository) : IQueryHandler<GetLogsQuery, Maybe<PagedList<LogResponse>>>
{
    public async Task<Maybe<PagedList<LogResponse>>> Handle(GetLogsQuery request, CancellationToken cancellationToken)
    {
        if(identifierProvider.Role == UserRole.Administrator.ToString() || identifierProvider.Role == UserRole.Superman.ToString())
        {
            (var logs, int total) = await logRepository.GetPaginateAllByKioskAsync(request.DeviceId, request.PageSize, request.PageNumber, request.From, request.To);
            return new PagedList<LogResponse>(logs.Select(l => l.Adapt<LogResponse>()).ToList(), total, request.PageNumber,request.PageSize);
        }
        else
        {
            if(await groupRepository.IsKioskInGroup(request.DeviceId,identifierProvider.GroupId!))
            {
                var kiosk = await kioskRepository.GetActiveKioskByAndroidIdAsync(request.DeviceId);
                string groupName = string.Empty;
                if(kiosk.HasValue && !string.IsNullOrEmpty(kiosk.Value.GroupId))
                {
                    var group = await groupRepository.GetByIdAsync(kiosk.Value.GroupId);
                    if (group.HasValue)
                    {
                        groupName = group.Value.GroupName;
                    }
                }
                (var logs, int total) = await logRepository.GetPaginateAllByKioskAsync(request.DeviceId, request.PageSize, request.PageNumber, request.From, request.To);
                var res = logs.Select(l=> new LogResponse
                {
                    DeviceId = l.DeviceId,
                    KioskName = kiosk.Value.KioskName ?? string.Empty,
                    GroupName = groupName,
                    Type = l.Type,
                    UrlAPI = l.UrlAPI,
                    JsonData = l.JsonData,
                    Desc = l.Desc,
                    CreatedAt = l.CreatedAt
                }).ToList();
                return new PagedList<LogResponse>(res, total, request.PageNumber, request.PageSize);
            }
            else
            {
                return Maybe<PagedList<LogResponse>>.None;
            }
        }
    }
}
