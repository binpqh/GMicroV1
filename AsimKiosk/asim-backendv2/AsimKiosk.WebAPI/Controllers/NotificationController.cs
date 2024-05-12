using AsimKiosk.Application.Core.Features.KioskApplication.Queries.GetConfigKiosk;
using AsimKiosk.Application.Core.Features.Notification.Command.MakeAsRead;
using AsimKiosk.Application.Core.Features.Notification.Query.GetAllNotificationByUserId;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.WebAPI.Contracts;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AsimKiosk.WebAPI.Controllers;

public class NotificationController(IMediator mediator) : APIController(mediator)
{
    [HttpGet("getNoti")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetNoti()
    {
        return await Maybe<GetAllNotificationByUserQuery>
                    .From(new GetAllNotificationByUserQuery())
                    .Bind(query => Mediator.Send(query))
                    .Match(Ok, NotFound);
    }
    [HttpPost("makeAsRead")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public Task<IActionResult> MakeAsRead(List<string> notificationIds)
        => Result.Create(notificationIds,DomainErrors.General.UnProcessableRequest)
        .Map(n => new MakeAsReadCommand(n))
        .Bind(command => Mediator.Send(command))
        .Match(Ok,Failure);
}
