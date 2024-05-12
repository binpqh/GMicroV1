using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Notification.Command.MakeAsRead;

public class MakeAsReadCommand(List<string> notifications) : ICommand<Result>
{
    public List<string> Notifications { get; set; } = notifications;
}
