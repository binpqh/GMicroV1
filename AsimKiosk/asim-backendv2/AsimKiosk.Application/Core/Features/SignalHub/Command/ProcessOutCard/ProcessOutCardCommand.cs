using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.SignalHub.Command.ProcessOutCard;

public class ProcessOutCardCommand(string orderCode, bool isSuccess, int currentSlot, string? serialNumber, bool isCompleted) : ICommand<Result>
{
    public string OrderCode { get; set; } = orderCode;
    public bool IsSuccess { get; set; } = isSuccess;
    public int CurrentSlot { get; set; } = currentSlot;
    public string? SerialNumber { get; set;} = serialNumber;
    public bool IsCompleted { get; set; } = isCompleted;
}
