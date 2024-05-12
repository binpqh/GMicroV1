using AsimKiosk.Application.Core.Features.Payment.Command.FetchPaymentMethod;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.WebAPI.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AsimKiosk.WebAPI.Controllers;

public class PaymentMethodController(IMediator mediator) : APIController(mediator)
{
    [AllowAnonymous]
    [HttpGet("fetch")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Fetch() =>
       await Result.Success(new FetchPaymentMethodCommand())
        .Bind(command => Mediator.Send(command))
        .Match(Ok, Failure);
}
