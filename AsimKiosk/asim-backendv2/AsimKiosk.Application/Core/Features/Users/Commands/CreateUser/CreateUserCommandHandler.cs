using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Cryptography;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.User.Authentication;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Users.Commands.CreateUser;
public class CreateUserCommandHandler(
    IUserIdentifierProvider currentUser,
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    IGroupRepository groupRepository)
    : ICommandHandler<CreateUserCommand, Result<RegisterResponse>>
{
    public async Task<Result<RegisterResponse>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        string groupName = string.Empty;
        string groupId = string.Empty;

        if (request.RegisterRequest.GroupId != null && !request.RegisterRequest.Role.Equals("Administrator"))
        {
            var group = await groupRepository.GetByIdAsync(request.RegisterRequest.GroupId);
            if (group.HasValue)
            {
                groupName = group.Value.GroupName;
                groupId = request.RegisterRequest.GroupId;
            }
        }
        else
        {
            if (currentUser.Role != UserRole.Superman.ToString())
            {
                return Result.Failure<RegisterResponse>(DomainErrors.Permission.InvalidPermissions);
            }
        }

        if (!await userRepository.IsEmailUniqueAsync(request.RegisterRequest.Email))
        {
            return Result.Failure<RegisterResponse>(DomainErrors.User.DuplicateEmail);
        }
        if (!await userRepository.IsUsernameUniqueAsync(request.RegisterRequest.UserName))
        {
            return Result.Failure<RegisterResponse>(DomainErrors.User.DuplicateUsername);
        }
        

        (string passwordHash, string salt) = passwordHasher.HashPassword(request.RegisterRequest.Password);
        var user = User.Create(
            groupId,
            request.RegisterRequest.UserName,
            request.RegisterRequest.FullName,
            request.RegisterRequest.Email,
            request.RegisterRequest.Role,
            passwordHash,
            salt,
            request.RegisterRequest.PhoneNumber,
            request.RegisterRequest.Address);

        userRepository.Insert(user);
        return Result.Success(new RegisterResponse
        {
            GroupName = groupName,
            Username = user.Username,
            Email = user.Email,
            Address = user.Address,
            PhoneNumber = user.PhoneNumber,
            Fullname = user.Fullname,
            Role = user.Role
        });
    }
}