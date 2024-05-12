using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.LocalSimAPIs.Command.DeleteConfig;

public class DeleteConfigLocalSimCommand(string id) : ICommand<Result>
{
    public string Id { get; set; } = id;
}
