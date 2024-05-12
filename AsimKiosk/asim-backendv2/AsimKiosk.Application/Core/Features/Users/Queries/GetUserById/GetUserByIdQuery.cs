using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Contracts.User;

namespace AsimKiosk.Application.Core.Features.Users.Queries.GetUserById;

public class GetUserByIdQuery(string? userId) : IQuery<Maybe<UserResponse>>
{
    public string UserId { get; } = userId ?? string.Empty;
}