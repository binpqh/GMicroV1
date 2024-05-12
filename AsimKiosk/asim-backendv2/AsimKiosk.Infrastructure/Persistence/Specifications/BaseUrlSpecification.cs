using AsimKiosk.Domain.Entities;
using System.Linq.Expressions;
using System.Net;

namespace AsimKiosk.Infrastructure.Persistence.Specifications;

public class BaseUrlSpecification(string url) : Specification<ExternalAPI>
{
    internal override Expression<Func<ExternalAPI, bool>> ToExpression() =>
        endpoint => endpoint.BaseUrl == url;
        
}
