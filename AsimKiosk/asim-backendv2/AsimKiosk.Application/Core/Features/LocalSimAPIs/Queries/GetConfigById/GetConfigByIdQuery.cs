using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.LocalSimApi;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.LocalSimAPIs.Queries.GetConfigById;
public class GetConfigByIdQuery(string id) : IQuery<Maybe<LocalSimConfigResponse>>
{
   public string Id { get; set; } = id;
}
