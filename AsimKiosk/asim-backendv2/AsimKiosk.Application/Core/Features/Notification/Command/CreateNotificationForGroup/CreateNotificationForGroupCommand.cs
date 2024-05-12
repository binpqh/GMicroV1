using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Application.Core.Features.Notification.Command.CreateNotificationForGroup;

public class CreateNotificationForGroupCommand(string? groupId, string? userId,ParentNavigate parentNavigate, TypeNotify typeNotify, string idNavigateChild) : ICommand<Result<Domain.Entities.Notification>>
{
    public string? CreateBy { get; set; } = userId;
    public string? GroupId { get; set; } = groupId;
    public ParentNavigate ParentNavigate { get; set; } = parentNavigate;
    public TypeNotify NotifyType { get; set; } = typeNotify;
    public string IdNavigateChild { get; set;} = idNavigateChild;
}