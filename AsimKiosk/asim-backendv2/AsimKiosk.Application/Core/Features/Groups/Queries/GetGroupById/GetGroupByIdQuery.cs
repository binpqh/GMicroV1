using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Group;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Groups.Queries.GetGroupById;

public class GetGroupByIdQuery(string? id) : IQuery<Maybe<GroupResponse>>
{
    public string Id { get; set; } = id ?? string.Empty;
}
