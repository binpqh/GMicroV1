using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.LocalSimAPIs.Command.ActiveConfig
{
    public class ActiveConfigSimLocalCommandHandler(ILocalSimConfigRepository localSimConfigRepository) : ICommandHandler<ActiveConfigLocalSimCommand, Result>
    {
        public async Task<Result> Handle(ActiveConfigLocalSimCommand request, CancellationToken cancellationToken)
        {
            var config = await localSimConfigRepository.GetByIdAsync(request.Id);

            if (config.HasNoValue) return Result.Failure(DomainErrors.ConfigSimLocal.NotFound);
            if (config.Value.Status == ActiveStatus.Active.ToString()) return Result.Success(); 
            var configActive = await localSimConfigRepository.GetActiveConfigAsync();
            if (configActive.HasValue)
            {
                configActive.Value.Status = ActiveStatus.Inactive.ToString();
            }
            config.Value.Status =ActiveStatus.Active.ToString();
            return Result.Success();
        }
    }
}
