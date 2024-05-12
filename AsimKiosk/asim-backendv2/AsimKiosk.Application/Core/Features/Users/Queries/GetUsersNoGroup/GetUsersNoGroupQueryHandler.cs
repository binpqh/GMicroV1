using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.User;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Users.Queries.GetUsersNoGroup;

internal class GetUsersNoGroupQueryHandler(
    IUserRepository userRepository,
    IUserIdentifierProvider userIdentifierProvider)
    : IQueryHandler<GetUsersNoGroupQuery, Maybe<PagedList<UserResponse>>>
{
    public async Task<Maybe<PagedList<UserResponse>>> Handle(GetUsersNoGroupQuery request, CancellationToken cancellationToken)
    {
        if (userIdentifierProvider.Role != UserRole.Administrator.ToString() &&
            userIdentifierProvider.Role != UserRole.Superman.ToString()) return Maybe<PagedList<UserResponse>>.None;
        var usersNoGroup = await userRepository.GetUserNoGroupAsync();
        var response = usersNoGroup
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Adapt<IEnumerable<UserResponse>>();
        return new PagedList<UserResponse>(response, usersNoGroup.Count(), request.Page, request.PageSize);
    }
}
