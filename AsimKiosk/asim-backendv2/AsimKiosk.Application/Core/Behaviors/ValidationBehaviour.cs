using AsimKiosk.Application.Core.Abstractions.Messaging;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using ValidationException = AsimKiosk.Domain.Core.Exceptions.ValidationException;

namespace AsimKiosk.Application.Core.Behaviors
{
    /// <summary>
    /// Represents the validation behaviour middleware.
    /// </summary>
    /// <typeparam name="TTRequest">The request type.</typeparam>
    /// <typeparam name="TTResponse">The response type.</typeparam>
    internal sealed class ValidationBehaviour<TTRequest, TTResponse> : IPipelineBehavior<TTRequest, TTResponse>
        where TTRequest : class, IRequest<TTResponse>
        where TTResponse : class
    {
        private readonly IEnumerable<IValidator<TTRequest>> _validators;

        /// <summary>
        /// Initializes a new instance of the <see cref="ValidationBehaviour{TRequest,TResponse}"/> class.
        /// </summary>
        /// <param name="validators">The validator for the current request type.</param>
        public ValidationBehaviour(IEnumerable<IValidator<TTRequest>> validators) => _validators = validators;

        public async Task<TTResponse> Handle(TTRequest request, RequestHandlerDelegate<TTResponse> next, CancellationToken cancellationToken)
        {
            //if (request is IQuery<TTResponse>)
            //{
            //    return await next();
            //}
            var context = new ValidationContext<TTRequest>(request);

            List<ValidationFailure> failures = _validators
                .Select(v => v.Validate(context))
                .SelectMany(result => result.Errors)
                .Where(f => f != null)
                .ToList();

            if (failures.Count != 0)
            {

                throw new ValidationException(failures);
            }
            return await next();
        }
    }
}