using MediatR;

namespace AsimKiosk.Application.Core.Abstractions.Messaging;

/// <summary>
/// Represents the query interface.
/// </summary>
/// <typeparam name="TAction">The action type.</typeparam>
/// <typeparam name="TTResponse">The query response type.</typeparam>
public interface IActionHandler<in TAction, TTResponse> : IRequestHandler<TAction, TTResponse>
    where TAction : IAction<TTResponse>
{
}
