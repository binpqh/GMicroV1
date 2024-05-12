using AsimKiosk.Domain.Core.Events;
using MongoDB.Bson;

namespace AsimKiosk.Domain.Core.Primitives
{
    public abstract class AggregateRoot : Entity
    {
        protected AggregateRoot(ObjectId id)
            : base(id)
        {
        }

        protected AggregateRoot()
        {
        }
        private readonly List<IDomainEvent> _domainEvents = new List<IDomainEvent>();
        public IReadOnlyCollection<IDomainEvent> DomainEvents => _domainEvents;
        public void ClearDomainEvents() => _domainEvents.Clear();

        protected void AddDomainEvent(IDomainEvent domainEvent) => _domainEvents.Add(domainEvent);
    }
}
