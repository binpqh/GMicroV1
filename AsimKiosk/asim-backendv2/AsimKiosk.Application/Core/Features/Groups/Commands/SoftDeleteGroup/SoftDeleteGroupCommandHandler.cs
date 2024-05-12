using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Groups.Commands.SoftDeleteGroup;

public class SoftDeleteGroupCommandHandler(IGroupRepository group, IUserRepository userRepository)
    : ICommandHandler<SoftDeleteGroupCommand, Result>
{
    public async Task<Result> Handle(SoftDeleteGroupCommand request, CancellationToken cancellationToken)
    {
        var group1 = await group.GetByIdAsync(request.GroupId);
        if (group1.HasNoValue) 
        {
            return Result.Failure(DomainErrors.Group.NotFoundWithId);
        }
        if ((await userRepository.GetUsersByGroupIdAsync(group1.Value.Id.ToString())).Any())
        {
            return Result.Failure(DomainErrors.Group.GroupNotEmpty);
        }
        await group.RemoveAsync(group1);
        return Result.Success();
    }
}
