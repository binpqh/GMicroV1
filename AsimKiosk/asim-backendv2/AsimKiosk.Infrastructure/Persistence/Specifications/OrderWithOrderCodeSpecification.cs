using AsimKiosk.Domain.Entities;
using System.Linq.Expressions;

namespace AsimKiosk.Infrastructure.Persistence.Specifications;

public class OrderWithOrderCodeSpecification(string orderCode) : Specification<Order>
{
    internal override Expression<Func<Order, bool>> ToExpression() => order => order.OrderCode == orderCode;
}

