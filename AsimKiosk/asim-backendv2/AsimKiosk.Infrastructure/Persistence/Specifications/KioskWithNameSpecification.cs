using AsimKiosk.Domain.Entities;
using System.Linq.Expressions;

namespace AsimKiosk.Infrastructure.Persistence.Specifications;

public class KioskWithNameSpecification(string name) : Specification<Kiosk>
{
    internal override Expression<Func<Kiosk, bool>> ToExpression()
        => kiosk => kiosk.KioskName == name;
}
