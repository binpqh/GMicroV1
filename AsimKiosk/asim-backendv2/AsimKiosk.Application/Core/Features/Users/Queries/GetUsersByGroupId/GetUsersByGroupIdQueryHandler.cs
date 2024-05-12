using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.Group;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Contracts.User;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Users.Queries.GetUsersByGroupId
{
    public class GetUsersByGroupIdQueryHandler(
        IUserRepository userRepository,
        IUserIdentifierProvider userIdentifierProvider)
        : IQueryHandler<GetUsersByGroupIdQuery, Maybe<PagedList<UserResponse>>>
    {
        public async Task<Maybe<PagedList<UserResponse>>> Handle(GetUsersByGroupIdQuery request, CancellationToken cancellationToken)
        {
            var groupId = userIdentifierProvider.GroupId;
            var userRole = userIdentifierProvider.Role;

            if (userRole == null || userRole.Equals("User") && groupId == null)
            {
                return Maybe<PagedList<UserResponse>>.None;
            }

            var userListByGroupId = await userRepository.GetUsersByGroupIdAsync(!string.IsNullOrEmpty(groupId) ? groupId : request.GroupId);

            var totalCount = userListByGroupId.Count;
            var response = userListByGroupId
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Adapt<IEnumerable<UserResponse>>();

            return new PagedList<UserResponse>(response, totalCount, request.Page, request.PageSize);
        }
    }
}