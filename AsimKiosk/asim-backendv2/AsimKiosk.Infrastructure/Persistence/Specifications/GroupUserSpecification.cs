using System.Linq.Expressions;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Infrastructure.Persistence.Specifications;

public class GroupUserSpecification(string groupId) : Specification<User>
{
    internal override Expression<Func<User, bool>> ToExpression()
    => user => user.GroupId == groupId;
}
