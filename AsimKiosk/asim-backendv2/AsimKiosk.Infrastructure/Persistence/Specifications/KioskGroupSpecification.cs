using AsimKiosk.Domain.Entities;
using System.Linq.Expressions;

namespace AsimKiosk.Infrastructure.Persistence.Specifications;

internal class KioskGroupSpecification(string groupId) : Specification<Kiosk>
{
    internal override Expression<Func<Kiosk, bool>> ToExpression()
        => kiosk => kiosk.GroupId == groupId;
}

