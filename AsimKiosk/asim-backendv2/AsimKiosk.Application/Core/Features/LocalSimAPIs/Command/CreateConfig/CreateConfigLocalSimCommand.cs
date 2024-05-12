using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.LocalSimApi;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.LocalSimAPIs.Command.CreateConfig;
public class CreateConfigLocalSimCommand(LocalSimConfigRequest apiConfigSimRequest) : ICommand<Result>
{
    public LocalSimConfigRequest ApiConfigSimRequest = apiConfigSimRequest;
}
