using AsimKiosk.Application.Core.Features.Kiosk.Command.UpdatePeripheral;
using AsimKiosk.Application.Core.Features.KioskApplication.Command.LogErrorAPIForKioskApp;
using AsimKiosk.Application.Core.Features.KioskApplication.Command.OrderByOrderCode;
using AsimKiosk.Application.Core.Features.KioskApplication.Command.RatingByOrderCode;
using AsimKiosk.Application.Core.Features.KioskApplication.Command.RegisterPackageSim;
using AsimKiosk.Application.Core.Features.KioskApplication.Command.RequestPayByOrderCode;
using AsimKiosk.Application.Core.Features.KioskApplication.Queries.CheckQuantity;
using AsimKiosk.Application.Core.Features.KioskApplication.Queries.GetAssets;
using AsimKiosk.Application.Core.Features.KioskApplication.Queries.GetConfigKiosk;
using AsimKiosk.Application.Core.Features.LogPeripherals.Command.Create;
using AsimKiosk.Application.Core.Features.LogPeripherals.Command.CreateLogPrinter;
using AsimKiosk.Application.Core.Features.LogPeripherals.Command.CreateLogTemp;
using AsimKiosk.Application.Core.Features.Payment.Command.TransactionRedirect;
using AsimKiosk.Application.Core.Features.Payment.Command.TransactionResult;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Contracts.LogAPI;
using AsimKiosk.Contracts.LogPeripherals;
using AsimKiosk.Contracts.Payment;
using AsimKiosk.Contracts.Payment.Hub;
using AsimKiosk.Contracts.Rating;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.WebAPI.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AsimKiosk.WebAPI.Controllers;

[Authorize(Roles = "Kiosk")]
public class AppKioskController(IMediator mediator) : APIController(mediator)
{
    [DisableRequestSizeLimit]
    [HttpPost("upload")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UploadVideoAsync([FromForm] KioskUploadRequest req)
    => await Result.Create(req, DomainErrors.General.UnProcessableRequest)
        .Map(request => new UploadVideoCommand(req))
        .Bind(command => Mediator.Send(command))
        .Match(Ok, NotFound);

    [HttpGet("getConfig")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ConfigureKiosk()
    {
        return await Maybe<GetConfigKioskQuery>
                    .From(new GetConfigKioskQuery())
                    .Bind(query => Mediator.Send(query))
                    .Match(Ok, NotFound);
    }


    [HttpGet("assets")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAssets()
    {
        string host = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}";

        return await Maybe<GetAssetsKioskQuery>.From(new GetAssetsKioskQuery(host))
           .Bind(query => Mediator.Send(query))
           .Match(Ok, NotFound);
    }

    [HttpGet("check-quantity")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CheckQuantity()
        => await Maybe<CheckQuantityQuery>.From(new CheckQuantityQuery())
           .Bind(query => Mediator.Send(query))
           .Match(Ok, NotFound);


    [HttpPost("addPackageSim")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> AddPackageSim(KioskAddSimPackageRequest addPackageRequest) =>
        await Result.Create(addPackageRequest, DomainErrors.General.UnProcessableRequest)
            .Map(request => new RegisterPackageSimCommand(addPackageRequest))
            .Bind(command => Mediator.Send(command))
            .Match(Ok, Failure);

    [HttpPost("order")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Order(CheckOrderRequest req) =>
       await Result.Create(req, DomainErrors.General.UnProcessableRequest)
        .Map(request => new OrderByOrderCodeCommand(request))
        .Bind(command => Mediator.Send(command))
        .Match(Ok, Failure);

    [HttpPost("payment")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Payment(PaymentRequest payRequest) =>
       await Result.Create(payRequest, DomainErrors.General.UnProcessableRequest)
        .Map(request => new RequestPayByOrderCodeCommand(payRequest))
        .Bind(command => Mediator.Send(command))
        .Match(Ok, Failure);

    [AllowAnonymous]
    [HttpGet("paymentCallBack")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> PaymentCallBack([FromQuery] IpnRequest request) =>
       await Result.Create(request, DomainErrors.General.UnProcessableRequest)
        .Map(request => new TransactionResultCommand(request))
        .Bind(command => Mediator.Send(command))
        .Match(Ok, Failure);

    [AllowAnonymous]
    [HttpGet("paymentRedirect")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> PaymentRedirect([FromQuery] RedirectRequest request) =>
       await Result.Create(request, DomainErrors.General.UnProcessableRequest)
        .Map(request => new TransactionRedirectCommand(request))
        .Bind(command => Mediator.Send(command))
        .Match(Ok, Failure);

    [HttpPost("rating")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Rating(RatingRequest req) =>
       await Result.Create(req, DomainErrors.General.UnProcessableRequest)
        .Map(req => new RatingByOrderCodeCommand(req.OrderCode, req.PointRating))
        .Bind(command => Mediator.Send(command))
        .Match(Ok, Failure);

    [HttpPost("logApi")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Logging(LogAPIRequest req) =>
       await Result.Create(req, DomainErrors.General.UnProcessableRequest)
        .Map(req => new LogAPICommand(req))
        .Bind(command => Mediator.Send(command))
        .Match(Ok, Failure);

    /// <summary>
    /// Author: Nguyen CT
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost("log-ups")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CreateLogUps(LogPeripheralsRequest request)
        => await Result.Create(request, DomainErrors.General.UnProcessableRequest)
        .Map(r => new CreateLogUpsCommand(request))
        .Bind(query => Mediator.Send(query))
        .Match(Ok, Failure);

    /// <summary>
    /// Author: Nguyen CT
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost("log-printer")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CreateLogPriter(LogPrinterRequest request)
        => await Result.Create(request, DomainErrors.General.UnProcessableRequest)
        .Map(r => new CreateLogPrinterCommand(request))
        .Bind(query => Mediator.Send(query))
        .Match(Ok, Failure);

    /// <summary>
    /// Author: Nguyen CT
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost("log-temperature")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CreateLogTemp(LogTempertureRequest request)
        => await Result.Create(request, DomainErrors.General.UnProcessableRequest)
        .Map(r => new CreateLogTempCommand(request))
        .Bind(query => Mediator.Send(query))
        .Match(Ok, Failure);
}