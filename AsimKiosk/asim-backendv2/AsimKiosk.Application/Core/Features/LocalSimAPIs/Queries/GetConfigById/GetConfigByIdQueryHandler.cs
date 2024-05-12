using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.LocalSimApi;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.LocalSimAPIs.Queries.GetConfigById;
public class GetConfigByIdQueryHandler(ILocalSimConfigRepository localSimConfigRepository) : IQueryHandler<GetConfigByIdQuery,Maybe<LocalSimConfigResponse>>
{
    public async Task<Maybe<LocalSimConfigResponse>> Handle(GetConfigByIdQuery request, CancellationToken cancellationToken)
    {
        var config = await localSimConfigRepository.GetByIdAsync(request.Id);
        if (config.HasNoValue) return Maybe<LocalSimConfigResponse>.None;
        var response = config.Value.Adapt<LocalSimConfigResponse>();
        return response;
    }
}
