using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Users.Commands.ChangeRole;

public class ChangeRoleCommandHandler(IUserRepository userRepository, IUserIdentifierProvider currentUser) : ICommandHandler<ChangeRoleCommand, Result>
{
    public async Task<Result> Handle(ChangeRoleCommand request, CancellationToken cancellationToken)
    {
        var role = currentUser.Role;
        var currentGroupUserId = currentUser.GroupId;
        var currentUserId = currentUser.NameIdentifier;

        var user = await userRepository.GetByIdAsync(request.ChangeRoleRequest.UserId);
        if (user.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.User));
        }
        if (user.Value.Id.ToString() == currentUserId)
        {
            return Result.Failure(DomainErrors.Permission.InvalidPermissions);
        }
        
        return Process(user, request.ChangeRoleRequest.Role.ToString(), role, currentGroupUserId) ? Result.Success() : Result.Failure(DomainErrors.Permission.InvalidPermissions);

    }
    private static bool Process(Domain.Entities.User user, string roleNeedToChange, string? currentRole, string? currentGroupUser)
    {
        switch (currentRole)
        {
            case "Superman":
                if (user.Role != UserRole.Superman.ToString())
                {
                    user.Role = roleNeedToChange;
                    return true;
                }
                break;
              
            case "Administrator":
                if (user.Role != UserRole.Administrator.ToString() && user.Role != UserRole.Superman.ToString())
                {
                    if (roleNeedToChange == UserRole.ManagerGroup.ToString() || roleNeedToChange == UserRole.User.ToString())
                    {
                        user.Role = roleNeedToChange;
                        return true;
                    }
                    
                }
                break;

            case "ManagerGroup":
                if (user.Role == UserRole.User.ToString())
                {
                    if (currentGroupUser != user.GroupId)
                        return false;
                    if (roleNeedToChange == UserRole.User.ToString())
                    {
                        user.Role = roleNeedToChange;
                        return true;
                    }
                }
                break;
            default:
                break;
        }
      
        return false;
    }
}