using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.LocalSimApi;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Application.Core.Features.LocalSimAPIs.Queries.GetConfig;
public class GetActiveConfigLocalSimQuery : IQuery<Maybe<LocalSimConfigResponse>>
{
}