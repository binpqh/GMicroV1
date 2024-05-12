using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Groups.Commands.UpdateGroup;

public class UpdateGroupCommandHandler(
    IGroupRepository group,
    IUserIdentifierProvider userIdentifierProvider)
    : ICommandHandler<UpdateGroupCommand, Result>
{
    public async Task<Result> Handle(UpdateGroupCommand request, CancellationToken cancellationToken)
    {
        var userRole = userIdentifierProvider.Role;
        var userGroup = userIdentifierProvider.GroupId;

        if (userRole == null)
        {
            return Result.Failure(DomainErrors.Permission.InvalidPermissions);
        }
        else if (userRole.Equals("ManagerGroup"))
        {
            if (userGroup != request.GroupId)
            {
                return Result.Failure(DomainErrors.Permission.InvalidPermissions);
            }
        }

        var group1 = await group.GetByIdAsync(request.GroupId);
        if (group1.HasNoValue)
        {
            return Result.Failure(DomainErrors.Group.NotFoundWithId);
        }
        group1.Value.GroupName = string.IsNullOrWhiteSpace(request.UpdateGroupRequest.GroupName) ? group1.Value.GroupName : request.UpdateGroupRequest.GroupName;
        group1.Value.Status = string.IsNullOrWhiteSpace(request.UpdateGroupRequest.ActiveStatus) ? group1.Value.Status : request.UpdateGroupRequest.ActiveStatus;
        return Result.Success();
    }
}
