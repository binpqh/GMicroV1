using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.ValueObject;

namespace AsimKiosk.Domain.Events;

public class PaymentConfigCreatedDomainEvent(PaymentConfig paymentConfig,string createBy) : IDomainEvent
{
    public PaymentConfig PaymentConfig { get; set; } = paymentConfig;
    //CreateBy => user id
    public string CreateBy { get; set; } = createBy;
}
public class PaymentConfigUpdateDomainEvent(PaymentConfig paymentConfig, string updateBy) : IDomainEvent
{
    public PaymentConfig PaymentConfig { get; set; } = paymentConfig;
    //CreateBy => user id
    public string UpdateBy { get; set; } = updateBy;
}