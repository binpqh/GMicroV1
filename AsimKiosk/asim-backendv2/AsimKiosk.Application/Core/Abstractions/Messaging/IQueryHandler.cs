using MediatR;

namespace AsimKiosk.Application.Core.Abstractions.Messaging;

/// <summary>
/// Represents the query interface.
/// </summary>
/// <typeparam name="TQuery">The query type.</typeparam>
/// <typeparam name="TTResponse">The query response type.</typeparam>
public interface IQueryHandler<in TQuery, TTResponse> : IRequestHandler<TQuery, TTResponse>
    where TQuery : IQuery<TTResponse>
{
}