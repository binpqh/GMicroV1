using AsimKiosk.Application.Core.Abstractions.AsimPackageSim;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Features.LocalSimAPIs.Queries.GetPackageSim;
using AsimKiosk.Contracts.LocalSimApi;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.LocalSimAPIs.Queries.GetConfig;
public class GetPackageSimQueryHandler(IPackageSim packageSim) :
    IQueryHandler<GetPackageSimQuery, Maybe<IEnumerable<GetPackageRespone>>>
{
    public async Task<Maybe<IEnumerable<GetPackageRespone>>> Handle(GetPackageSimQuery request, CancellationToken cancellationToken)
        => (await packageSim.GetPackagesAsync()).ToArray();
}
