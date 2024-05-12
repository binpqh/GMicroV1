using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.KioskApplication.Command.RegisterPackageSim;

public class RegisterPackageSimCommand(KioskAddSimPackageRequest kioskAddSimPackageRequest) : ICommand<Result>
{
    public string SerialSim { get; set; } = kioskAddSimPackageRequest.SerialSim;
    public string OrderCode { get; set; } = kioskAddSimPackageRequest.OrderCode;
    // public string Packet { get; set; } = kioskAddSimPackageRequest.Packet;
}
