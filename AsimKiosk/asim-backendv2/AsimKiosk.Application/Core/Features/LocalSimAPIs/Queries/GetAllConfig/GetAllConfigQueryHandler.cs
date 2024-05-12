using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.LocalSimApi;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.LocalSimAPIs.Queries.GetAllConfig
{
    public class GetAllConfigQueryHandler(ILocalSimConfigRepository localSimConfigRepository) : IQueryHandler<GetAllConfigQuery, Maybe<List<LocalSimConfigResponse>>>
    {
        public async Task<Maybe<List<LocalSimConfigResponse>>> Handle(GetAllConfigQuery request, CancellationToken cancellationToken)
        {
            var config = await localSimConfigRepository.GetAllConfig();
            return config.Adapt<List<LocalSimConfigResponse>>();
        }
    }
}
