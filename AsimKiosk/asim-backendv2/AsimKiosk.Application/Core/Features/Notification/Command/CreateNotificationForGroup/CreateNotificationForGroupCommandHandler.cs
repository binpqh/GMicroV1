using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Common;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Notification.Command.CreateNotificationForGroup;

internal class CreateNotificationForGroupCommandHandler(INotificationRepository notificationRepository,IUserRepository userRepository,IGroupRepository groupRepository) : ICommandHandler<CreateNotificationForGroupCommand, Result<Domain.Entities.Notification>>
{
    public async Task<Result<Domain.Entities.Notification>> Handle(CreateNotificationForGroupCommand request, CancellationToken cancellationToken)
    {
        if(await notificationRepository.IsDuplicateAsync(request.GroupId, request.IdNavigateChild, request.ParentNavigate.ToString()))
        {
            return Result.Failure<Domain.Entities.Notification>(DomainErrors.General.IsDuplicated);
        }
        var user = string.IsNullOrEmpty(request.CreateBy) ? Maybe<User>.None: await userRepository.GetByIdAsync(request.CreateBy);
        (var desc,var descVn) = NotificationHelper.GetDescription(request.NotifyType, request.ParentNavigate, user.HasNoValue ? string.Empty : user.Value.Fullname);

        var notification = new Domain.Entities.Notification
        {
            GroupName = groupRepository.GetGroupNameById(request.GroupId),
            GroupId = request.GroupId ?? string.Empty,
            IdNavigateChild = request.IdNavigateChild,
            NotifyType = request.NotifyType.ToString(),
            ParentNavigate = request.ParentNavigate.ToString(),
            CreateAt = DateTime.UtcNow,
            Description = desc,
            DescriptionVN = descVn,
        };
        notificationRepository.Insert(notification);
        return Result.Success(notification);
    }
}
