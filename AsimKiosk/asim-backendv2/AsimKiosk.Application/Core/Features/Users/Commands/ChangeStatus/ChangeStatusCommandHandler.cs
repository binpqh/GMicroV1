using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Users.Commands.ChangeStatus;

public class ChangeStatusCommandHandler(IUserRepository userRepository, IUserIdentifierProvider currentUser) : ICommandHandler<ChangeStatusCommand, Result>
{
    public async Task<Result> Handle(ChangeStatusCommand request, CancellationToken cancellationToken)
    {
        var currentUserId = currentUser.NameIdentifier;

        var user = await userRepository.GetByIdAsync(request.ChangeStatusRequest.UserId);

        if (user.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.User));
        }
        if (user.Value.Status == request.ChangeStatusRequest.Status.ToString())
        {
            return Result.Failure(DomainErrors.User.DuplicateStatus);
        }
        if (user.Value.Id.ToString() == currentUserId)
        {
            return Result.Failure(DomainErrors.Permission.InvalidPermissions);
        }

        return Process(user, currentUser, request.ChangeStatusRequest.Status) ? Result.Success() : Result.Failure(DomainErrors.Permission.InvalidPermissions);
    }
    private static bool Process(Domain.Entities.User user, IUserIdentifierProvider currentUser, ActiveStatus statusNeedToChange)
    {
        switch (currentUser.Role)
        {
            case "Superman":
                if (user.Role != UserRole.Superman.ToString())
                {
                    user.Status = statusNeedToChange.ToString();
                    return true;
                }
                break;
            case "Administrator":
                if (user.Role != UserRole.Administrator.ToString() && user.Role != UserRole.Superman.ToString())
                {
                    user.Status = statusNeedToChange.ToString();
                    return true;
                }
                break;

            case "ManagerGroup":
                if (user.Role == UserRole.User.ToString())
                {
                    if (currentUser.GroupId != user.GroupId) return false;
                    user.Status = statusNeedToChange.ToString();
                    return true;
                }
                break;
            default:
                return false;
        }
        return false;
    }

}
