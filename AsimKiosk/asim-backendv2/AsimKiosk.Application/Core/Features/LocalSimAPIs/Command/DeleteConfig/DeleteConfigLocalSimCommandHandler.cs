using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.LocalSimAPIs.Command.DeleteConfig;

public class DeleteConfigLocalSimCommandHandler(ILocalSimConfigRepository localSimConfigRepository) : ICommandHandler<DeleteConfigLocalSimCommand, Result>
{
    public async Task<Result> Handle(DeleteConfigLocalSimCommand request, CancellationToken cancellationToken)
    {
       var config = await localSimConfigRepository.GetByIdAsync(request.Id);
       if (config.HasNoValue) return Result.Failure(DomainErrors.ConfigSimLocal.NotFound);
       if (config.Value.Status == ActiveStatus.Active.ToString()) return Result.Failure(DomainErrors.ConfigSimLocal.CanNotDelete);
       await localSimConfigRepository.RemoveAsync(config); 
       return Result.Success();
    }
}
