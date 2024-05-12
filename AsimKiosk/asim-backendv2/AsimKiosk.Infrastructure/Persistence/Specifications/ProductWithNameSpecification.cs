using AsimKiosk.Domain.Entities;
using System.Linq.Expressions;

namespace AsimKiosk.Infrastructure.Persistence.Specifications;

public class ProductWithCodeSpecification(string productCode) : Specification<Product>
{
    internal override Expression<Func<Product, bool>> ToExpression() => product => product.ProductCode == productCode;
}
