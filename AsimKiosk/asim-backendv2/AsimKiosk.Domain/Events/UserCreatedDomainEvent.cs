using AsimKiosk.Domain.Core.Events;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Events
{
    public class UserCreatedDomainEvent : IDomainEvent
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="UserCreatedDomainEvent"/> class.
        /// </summary>
        /// <param name="user">The user.</param>
        public UserCreatedDomainEvent(User user) => User = user;
        public User User { get; }
    }
}