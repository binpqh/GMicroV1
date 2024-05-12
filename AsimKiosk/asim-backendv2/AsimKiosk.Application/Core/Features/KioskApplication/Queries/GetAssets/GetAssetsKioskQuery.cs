using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.KioskApplication.Queries.GetAssets;

public class GetAssetsKioskQuery(string hostName) : IQuery<Maybe<IEnumerable<string>>>
{
    public string HostName {get;set;} = hostName;
}