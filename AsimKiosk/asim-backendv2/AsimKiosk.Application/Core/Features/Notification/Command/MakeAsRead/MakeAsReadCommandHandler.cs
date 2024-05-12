using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Notification.Command.MakeAsRead;

internal class MakeAsReadCommandHandler(INotificationRepository notificationRepository, IUserIdentifierProvider userIdentifierProvider) : ICommandHandler<MakeAsReadCommand, Result>
{
    public async Task<Result> Handle(MakeAsReadCommand request, CancellationToken cancellationToken)
    {
        var notis = await notificationRepository.GetNotificationsByListId(request.Notifications);
        if (notis != null && notis.Count > 0)
        {
            notis.Select(n =>
            {
                n.UserMarkedAsRead.Add(userIdentifierProvider.NameIdentifier!);
                return n;
            }).ToList();
        }
        return Result.Success();
    }
}
