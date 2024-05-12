using AsimKiosk.Application.Core.Features.ConfigPayment.Command.CreateConfigPayment;
using AsimKiosk.Contracts.PaymentConfigure;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.WebAPI.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AsimKiosk.Application.Core.Features.ConfigPayment.Command.UpdateConfigPayment;
using AsimKiosk.Application.Core.Features.ConfigPayment.Queries.GetPaymentConfigs;
using AsimKiosk.Application.Core.Features.ConfigPayment.Command.ChangeStatusConfigPayment;


namespace AsimKiosk.WebAPI.Controllers;

public class ConfigurePaymentController(IMediator mediator) : APIController(mediator)
{
   
    [Authorize(Roles = "Administrator")]
    [HttpGet("getAll")]
    [ProducesResponseType(typeof(PaymentConfigResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAllPaymentConfig() =>
       await Maybe<GetPaymentConfigsQuery>
        .From(new GetPaymentConfigsQuery())
        .Bind(query => Mediator.Send(query))
        .Match(Ok, NotFound);
    [Authorize(Roles = "Administrator")]
    [HttpPost("add")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddPaymentConfigure(CreatePaymentConfigRequest req)
    => await Result.Create(req, DomainErrors.General.UnProcessableRequest)
    .Map(request => new CreateConfigPaymentCommand(req))
    .Bind(command => Mediator.Send(command))
    .Match(Ok, Failure);

    [Authorize(Roles = "Administrator")]
    [HttpPost("update")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdatePaymentConfig(UpdatePaymentConfigRequest request)
         => await Result.Create(request, DomainErrors.General.UnProcessableRequest)
         .Map(rq => new UpdateConfigPaymentCommand(request))
         .Bind(command => Mediator.Send(command))
         .Match(Ok, Failure);

    [Authorize(Roles = "Administrator")]
    [HttpPost("changeStatus")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangeConfigPaymentStatus(ChangeStatusPaymentConfigRequest request)
         => await Result.Create(request, DomainErrors.General.UnProcessableRequest)
         .Map(rq => new ChangeStatusConfigPaymentCommand(request))
         .Bind(command => Mediator.Send(command))
         .Match(Ok, Failure);

}
