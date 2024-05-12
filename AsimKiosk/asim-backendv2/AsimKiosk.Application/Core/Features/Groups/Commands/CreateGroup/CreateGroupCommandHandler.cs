using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Groups.Commands.CreateGroup;

public class CreateGroupCommandHandler(IGroupRepository group, IUserIdentifierProvider userIdentifierProvider)
    : ICommandHandler<CreateGroupCommand, Result>
{
    public async Task<Result> Handle(CreateGroupCommand request, CancellationToken cancellationToken)
    {
        var role = userIdentifierProvider.Role;
        if (role == null || !(role.Equals("Administrator") || role.Equals("Superman")))
        {
            return Result.Failure(DomainErrors.Permission.InvalidPermissions);
        }

        if (!await group.IsGroupNameUniqueAsync(request.GroupName))
        {
            return Result.Failure(DomainErrors.Group.DuplicateName);
        }
        var group1 = Group.Create(request.GroupName);
        group.Insert(group1);
        return Result.Success();
    }
}
