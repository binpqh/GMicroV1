using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Cryptography;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.User.Authentication;
using AsimKiosk.Domain.Core.Abstractions;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Users.Commands.ChangePassword;

public class ChangeUserPasswordCommandHandler(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    IPasswordHashChecker passwordHashChecker,
    IUserIdentifierProvider currentUser)
    : ICommandHandler<ChangeUserPasswordCommand, Result>
{
    public async Task<Result> Handle(ChangeUserPasswordCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var allowedRoles = new List<string>
            {
                UserRole.Administrator.ToString(),
                UserRole.Superman.ToString()
            };

            var user = await userRepository.GetByIdAsync(
                allowedRoles.Contains(currentUser.Role!) ? request.ChangeUserPasswordRequest.UserId : currentUser.NameIdentifier!);

            var isPasswordValid = passwordHashChecker.HashesMatch(request.ChangeUserPasswordRequest.OldPassword, user.Value);
            if (!isPasswordValid)
            {
                return Result.Failure<AuthResponse>(DomainErrors.UserAuthentication.InvalidPassword);
            }

            (string passwordHash, string salt) = passwordHasher.HashPassword(request.ChangeUserPasswordRequest.NewPassword);
            user.Value.Salt = salt;
            user.Value.Password = passwordHash;
            return Result.Success();
        }
        catch
        {
            return Result.Failure<AuthResponse>(DomainErrors.Permission.InvalidPermissions);
        }
        
    }
}