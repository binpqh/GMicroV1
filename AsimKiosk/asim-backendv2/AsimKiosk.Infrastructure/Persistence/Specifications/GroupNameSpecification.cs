using AsimKiosk.Domain.Entities;
using System.Linq.Expressions;

namespace AsimKiosk.Infrastructure.Persistence.Specifications;

public class GroupNameSpecification(string name) : Specification<Group>
{
    internal override Expression<Func<Group, bool>> ToExpression()
        => group => group.GroupName == name;
}
