using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Notification;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Notification.Query.GetAllNotificationByUserId;

internal class GetAllNotificationByUserQueryHandler(INotificationRepository notificationRepository,IUserIdentifierProvider userIdentifierProvider) : IQueryHandler<GetAllNotificationByUserQuery, Maybe<NotificationResponse>>
{
    public async Task<Maybe<NotificationResponse>> Handle(GetAllNotificationByUserQuery request, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrEmpty(userIdentifierProvider.NameIdentifier) && !string.IsNullOrEmpty(userIdentifierProvider.Role))
        {
            if(userIdentifierProvider.Role == UserRole.Administrator.ToString() || userIdentifierProvider.Role == UserRole.Superman.ToString())
            {
                (var notifications, int unreadNumber) = await notificationRepository.GetAllByUser(userIdentifierProvider.NameIdentifier, null);
                return new NotificationResponse
                {
                    NotificationDetails = notifications.Select(n => new NotificationDetail
                    {
                        Id = n.Id.ToString(),
                        GroupId = n.GroupId,
                        IdNavigateChild = n.IdNavigateChild,
                        ParentNavigate = n.ParentNavigate,
                        Description = n.Description ?? string.Empty,
                        DescriptionVN = n.DescriptionVN ?? string.Empty,
                        NotifyType = n.NotifyType,
                        IsRead = n.UserMarkedAsRead.Contains(userIdentifierProvider.NameIdentifier),
                    }).ToList(),
                    UnreadNumber = unreadNumber
                };
            }
            else
            {
                (var notifications, int unreadNumber) = await notificationRepository.GetAllByUser(userIdentifierProvider.NameIdentifier, userIdentifierProvider.GroupId);
                return new NotificationResponse
                {
                    NotificationDetails = notifications.Select(n => new NotificationDetail
                    {
                        Id = n.Id.ToString(),
                        GroupId = n.GroupId,
                        IdNavigateChild = n.IdNavigateChild,
                        ParentNavigate = n.ParentNavigate,
                        Description = n.Description ?? string.Empty,
                        DescriptionVN = n.DescriptionVN ?? string.Empty,
                        NotifyType = n.NotifyType,
                        IsRead = n.UserMarkedAsRead.Contains(userIdentifierProvider.NameIdentifier),
                    }).ToList(),
                    UnreadNumber = unreadNumber
                };
            }
        }
        else
        {
            return Maybe<NotificationResponse>.None;
        }
    }
}
