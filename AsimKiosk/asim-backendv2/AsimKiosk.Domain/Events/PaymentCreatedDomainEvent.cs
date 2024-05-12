using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Events
{
    public class PaymentCreatedDomainEvent : IDomainEvent
    {
        internal PaymentCreatedDomainEvent(Payment payment) => Payment = payment;
        public Payment Payment { get; }
    }
}
