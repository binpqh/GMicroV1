using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.LocalSimApi;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.LocalSimAPIs.Queries.GetPackageSim;
public class GetPackageSimQuery() : IQuery<Maybe<IEnumerable<GetPackageRespone>>>
{

}