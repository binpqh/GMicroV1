using AsimKiosk.Domain.ValueObject;

namespace AsimKiosk.Contracts.Payment.Hub;

public class FetchPaymentMethodResponse
{
    public ICollection<PaymentMethod> PaymentMethods { get; set; } = new List<PaymentMethod>();
}
