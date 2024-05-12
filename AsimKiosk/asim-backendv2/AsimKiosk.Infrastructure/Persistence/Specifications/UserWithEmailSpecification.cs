using System.Linq.Expressions;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Infrastructure.Persistence.Specifications
{
    internal sealed class UserWithEmailSpecification : Specification<User>
    {
        private readonly string _email;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserWithEmailSpecification"/> class.
        /// </summary>
        /// <param name="email">The email.</param>
        internal UserWithEmailSpecification(string email) => _email = email;

        /// <inheritdoc />
        internal override Expression<Func<User, bool>> ToExpression() => user => user.Email == _email;
    }
}