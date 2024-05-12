using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.LocalSimApi;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.LocalSimAPIs.Queries.GetConfig;

public class GetActiveConfigLocalSimQueryHandler(ILocalSimConfigRepository localSimConfigRepository) :
    IQueryHandler<GetActiveConfigLocalSimQuery, Maybe<LocalSimConfigResponse>>
{
    public async Task<Maybe<LocalSimConfigResponse>> Handle(GetActiveConfigLocalSimQuery request, CancellationToken cancellationToken)
    {
        var config = await localSimConfigRepository.GetActiveConfigAsync();
        if (config.HasNoValue) return Maybe<LocalSimConfigResponse>.None;
        return config.Value.Adapt<LocalSimConfigResponse>();
    }
}
