using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Contracts.User;

namespace AsimKiosk.Application.Core.Features.Users.Queries.GetMe;

public class GetMeQuery() : IQuery<Maybe<UserResponse>>
{
}