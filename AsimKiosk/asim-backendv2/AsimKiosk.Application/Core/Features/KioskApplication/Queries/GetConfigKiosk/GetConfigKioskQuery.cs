using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk.Config;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.KioskApplication.Queries.GetConfigKiosk;

public class GetConfigKioskQuery : IQuery<Maybe<KioskConfigResult>>
{
}