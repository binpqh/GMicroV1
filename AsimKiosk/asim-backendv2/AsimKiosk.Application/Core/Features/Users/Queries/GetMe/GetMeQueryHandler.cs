using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.User;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Users.Queries.GetMe;

public class GetMeQueryHandler(IUserIdentifierProvider userIdentifierProvider,IUserRepository userRepository)
    : IQueryHandler<GetMeQuery, Maybe<UserResponse>>
{
    public async Task<Maybe<UserResponse>> Handle(GetMeQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(userIdentifierProvider.NameIdentifier))
        {
            return Maybe<UserResponse>.None;
        }
        var user = await userRepository.GetByIdAsync(userIdentifierProvider.NameIdentifier);
        var response = user.Value.Adapt<UserResponse>();
        return response;
    }
}