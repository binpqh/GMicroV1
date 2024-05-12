using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Kiosk.Command.UpdateKioskDetails;

public class UpdateKioskDetailsCommand(string id, KioskUpdateRequest request) : ICommand<Result>
{
    public string DeviceId { get; set;} = id;
    public KioskUpdateRequest UpdateRequest { get; set; } = request;
}
