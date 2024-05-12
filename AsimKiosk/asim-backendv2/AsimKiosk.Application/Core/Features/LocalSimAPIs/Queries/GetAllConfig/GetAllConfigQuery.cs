using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.LocalSimApi;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.LocalSimAPIs.Queries.GetAllConfig;

public class GetAllConfigQuery : IQuery<Maybe<List<LocalSimConfigResponse>>>
{
}
