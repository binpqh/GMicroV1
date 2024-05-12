using MediatR;
namespace AsimKiosk.Application.Core.Abstractions.Messaging;

/// <summary>
/// Represents the query interface.
/// </summary>
/// <typeparam name="TTResponse">The query response type.</typeparam>
public interface IQuery<out TTResponse> : IRequest<TTResponse>
{
}