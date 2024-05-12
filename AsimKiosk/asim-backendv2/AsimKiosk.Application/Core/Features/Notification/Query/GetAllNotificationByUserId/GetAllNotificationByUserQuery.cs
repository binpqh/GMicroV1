using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Notification;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Application.Core.Features.Notification.Query.GetAllNotificationByUserId;

public class GetAllNotificationByUserQuery : IQuery<Maybe<NotificationResponse>>
{
}
