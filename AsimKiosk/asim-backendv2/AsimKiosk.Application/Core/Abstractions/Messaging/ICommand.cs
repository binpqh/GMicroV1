using MediatR;
namespace AsimKiosk.Application.Core.Abstractions.Messaging;

/// <summary>
/// Represents the command interface.
/// </summary>
/// <typeparam name="TTResponse">The command response type.</typeparam>
public interface ICommand<out TTResponse> : IRequest<TTResponse>
{
}