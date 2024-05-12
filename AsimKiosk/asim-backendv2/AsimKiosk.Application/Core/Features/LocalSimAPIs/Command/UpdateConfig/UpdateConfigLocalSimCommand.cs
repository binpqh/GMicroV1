
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.LocalSimApi;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.LocalSimAPIs.Command.UpdateConfig;

public class UpdateConfigLocalSimCommand(string id , LocalSimConfigRequest localSimConfig) : ICommand<Result>
{
    public string Id { get; set; } = id;
    public LocalSimConfigRequest LocalSimConfig { get; set; } = localSimConfig;
}
