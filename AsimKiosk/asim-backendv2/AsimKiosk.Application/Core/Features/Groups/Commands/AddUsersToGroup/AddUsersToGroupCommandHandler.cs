using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Common;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using MongoDB.Bson;

namespace AsimKiosk.Application.Core.Features.Groups.Commands.AddUsersToGroup;

public class AddUsersToGroupCommandHandler(
    IGroupRepository groupRepository,
    IUserIdentifierProvider userIdentifierProvider,
    IUserRepository userRepository)
    : ICommandHandler<AddUsersToGroupCommand, Result>
{
    public async Task<Result> Handle(AddUsersToGroupCommand request, CancellationToken cancellationToken)
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
        var group = await groupRepository.GetByIdAsync(request.GroupId);
        
        if (group.HasNoValue)
        {
            return Result.Failure(DomainErrors.General.NotFoundSpecificObject(ObjectName.Group));
        }

        await userRepository.InsertUsersToGroupAsync(group.Value.Id.ToString(), request.AddUsersRequest.UserIds);
        return Result.Success();
    }
    
}
