using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.KioskApplication.Command.LogErrorAPIForKioskApp;
internal class LogAPICommandHandler(ILogRepository logRepository, IKioskIdentifierProvider kioskIdentifierProvider)
    : ICommandHandler<LogAPICommand, Result>
{
    public async Task<Result> Handle(LogAPICommand request, CancellationToken cancellationToken)
    {
        var log = await logRepository.GetSameIssueAsync(request.Request.UrlAPI, request.Request.JsonData);
        if (log.HasNoValue)
        {
            logRepository.Insert(new Domain.Entities.Log
            {
                JsonData = request.Request.JsonData,
                DeviceId = kioskIdentifierProvider.DeviceId ?? string.Empty,
                UrlAPI = request.Request.UrlAPI,
                Desc = request.Request.Desc,
            });
        }
        else
        {
            log.Value.CreatedAt = DateTime.UtcNow;
        }
        return Result.Success();
    }
}
