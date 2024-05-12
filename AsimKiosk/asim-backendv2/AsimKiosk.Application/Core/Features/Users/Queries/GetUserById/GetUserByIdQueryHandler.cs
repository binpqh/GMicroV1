using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.User;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Users.Queries.GetUserById;

public class GetUserByIdQueryHandler(IUserRepository userRepository)
    : IQueryHandler<GetUserByIdQuery, Maybe<UserResponse>>
{
    public async Task<Maybe<UserResponse>> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.UserId.ToString()))
        {
            return Maybe<UserResponse>.None;
        }

        var user = await userRepository.GetByIdAsync(request.UserId);

        if(user.HasNoValue)
        {
            return Maybe<UserResponse>.None;
        }

        var response = user.Value.Adapt<UserResponse>();
        return response;
    }
}