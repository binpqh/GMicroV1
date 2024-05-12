using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;


namespace AsimKiosk.Application.Core.Features.Users.Commands.UpdateUser;

public class UpdateUserCommandHandler(IUserRepository userRepository, IUserIdentifierProvider currentUser) : ICommandHandler<UpdateUserCommand, Result>
{
    public async Task<Result> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByIdAsync(request.UpdateUserRequest.Id);
        if (user.HasNoValue) 
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.User));
        }
        var currentUserId = currentUser.NameIdentifier;

        if(currentUserId == request.UpdateUserRequest.Id)
        {
            if (!string.IsNullOrEmpty(request.UpdateUserRequest.Email))
            {
                var checkEmailUnique = await userRepository.IsEmailUniqueAsync(request.UpdateUserRequest.Email);
                if (!checkEmailUnique)
                {
                    return Result.Failure(DomainErrors.User.DuplicateEmail);
                }
            }
            UpdateUserData(user, request);
            return Result.Success();
        }


        var currentRole = currentUser.Role;
        var currentUserGroup = currentUser.GroupId;

        return Process(user, currentRole, request, currentUserGroup) ? Result.Success() : Result.Failure(DomainErrors.Permission.InvalidPermissions);
    }
    private static bool Process(Domain.Entities.User userToEdit, string? currentRole, UpdateUserCommand request, string? currentUserGroup)
    {
        {
            switch (currentRole)
            {
                case "Superman":
                    if (userToEdit.Role != UserRole.Superman.ToString())
                    {
                        UpdateUserData(userToEdit, request);
                        return true;
                    }
                    break;

                case "Administrator":
                    if (userToEdit.Role != UserRole.Administrator.ToString() && userToEdit.Role != UserRole.Superman.ToString())
                    {
                        UpdateUserData(userToEdit, request);
                        return true;
                    }
                    break;

                case "ManagerGroup":
                    if (userToEdit.Role == UserRole.User.ToString())
                    {
                        if (currentUserGroup != userToEdit.GroupId)
                            return false;
                        UpdateUserData(userToEdit, request);
                        return true;
                    }
                    break;
                default:
                    break;
            }

            return false;
        }
    }

    private static void UpdateUserData(Domain.Entities.User user, UpdateUserCommand request)
    {
        user.Fullname = string.IsNullOrWhiteSpace(request.UpdateUserRequest.FullName) ? user.Fullname : request.UpdateUserRequest.FullName;
        user.Address = string.IsNullOrWhiteSpace(request.UpdateUserRequest.Address) ? user.Address : request.UpdateUserRequest.Address;
        user.PhoneNumber = string.IsNullOrWhiteSpace(request.UpdateUserRequest.PhoneNumber) ? user.PhoneNumber : request.UpdateUserRequest.PhoneNumber;
        user.Email = string.IsNullOrWhiteSpace(request.UpdateUserRequest.Email) ? user.Email : request.UpdateUserRequest.Email;
    }
}
