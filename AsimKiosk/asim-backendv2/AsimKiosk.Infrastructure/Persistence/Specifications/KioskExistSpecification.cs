using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using System.Linq.Expressions;

namespace AsimKiosk.Infrastructure.Persistence.Specifications;

public class KioskExistSpecification(string androidId) : Specification<Kiosk>
{
    internal override Expression<Func<Kiosk, bool>> ToExpression()
        => k => k.DeviceId == androidId && k.Status == ActiveStatus.Active.ToString();
}

