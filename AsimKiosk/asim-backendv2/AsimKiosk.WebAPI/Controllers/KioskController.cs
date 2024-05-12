using AsimKiosk.Application.Core.Features.Inventory.Command.AddQuantityIntoDispenser;
using AsimKiosk.Application.Core.Features.Kiosk.Queries.GetKioskByGroup;
using AsimKiosk.Application.Core.Features.Kiosk.Action.RebootKioskByDeviceId;
using AsimKiosk.Contracts.Kiosk.Inventory;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.WebAPI.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AsimKiosk.Application.Core.Features.Kiosk.Command.ApproveKioskWithDeviceId;
using AsimKiosk.Application.Core.Features.Kiosk.Queries.GetKioskList;
using AsimKiosk.Application.Core.Features.Kiosk.Queries.GetKioskByDeviceId;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Application.Core.Features.Kiosk.Command.UpdateKioskDetails;
using AsimKiosk.Contracts.Kiosk.Peripheral;
using AsimKiosk.Application.Core.Features.Kiosk.Queries.GetSinglePeripheralLogs;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Application.Core.Features.Kiosk.Command.UpdatePeripheral;
using AsimKiosk.Application.Core.Features.Kiosk.Queries.GetKiosksDropdown;
using AsimKiosk.Application.Core.Features.Kiosk.Command.ChangePeripheralStatus;
using AsimKiosk.Application.Core.Features.Kiosk.Queries.GetVideoList;
using Mapster;
using AsimKiosk.Application.Core.Features.Kiosk.Action.KioskLockerByDeviceId;
using AsimKiosk.Application.Core.Features.Kiosk.Command.ActiveKiosk;
using AsimKiosk.Application.Core.Features.Kiosk.Action.ReactiveKioskByDeviceId;
using AsimKiosk.Application.Core.Features.Kiosk.Queries.GetGroupKioskDropdown;
using AsimKiosk.Application.Core.Features.Kiosk.Action.RefreshKioskByDeviceId;

namespace AsimKiosk.WebAPI.Controllers;

public class KioskController(IMediator mediator) : APIController(mediator)
{
 

    [Authorize]
    [HttpGet("getAll")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAllKioskAsync()
        => await Maybe<GetKioskListQuery>
        .From(new GetKioskListQuery())
        .Bind(query => Mediator.Send(query))
        .Match(Ok, NotFound);

    [Authorize]
    [HttpGet("dropDown")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetKioskDropDownAsync()
        => await Maybe<GetKiosksDropdownQuery>
        .From(new GetKiosksDropdownQuery())
        .Bind(query => Mediator.Send(query))
        .Match(Ok, NotFound);

    [Authorize(Policy = "Manager")]
    [HttpGet("groupKioskDropdown")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetGroupKioskDropdownAsync()
        => await Maybe<GetGroupKioskDropdownQuery>
        .From(new GetGroupKioskDropdownQuery())
        .Bind(query => Mediator.Send(query))
        .Match(Ok, NotFound);

    [HttpGet("getByDeviceId")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetKioskByDeviceId(string deviceId)
        => await Maybe<GetKioskByDeviceIdQuery>
            .From(new GetKioskByDeviceIdQuery(deviceId))
            .Bind(query => Mediator.Send(query))
            .Match(Ok, NotFound);

    [Authorize(Policy = "Manager")]
    [HttpPatch("updateDetails")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateKioskDetails(string deviceId, KioskUpdateRequest req)
        => await Result.Create(req, DomainErrors.General.UnProcessableRequest)
            .Map(request => new UpdateKioskDetailsCommand(deviceId, request))
            .Bind(command => Mediator.Send(command))
            .Match(Ok, Failure);

    [Authorize(Policy = "Manager")]
    [HttpPut("activeKiosk")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ActiveKioskStatus(string? deviceId)
        => await Result.Create(deviceId, DomainErrors.General.FailRequest(deviceId))
            .Map(request => new ActiveKioskCommand(request))
            .Bind(command => Mediator.Send(command))
            .Match(Ok, Failure);

    [Authorize(Policy = "Manager")]
    [HttpPut("inactiveKiosk")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> InactiveKioskStatus(string? deviceId)
        => await Result.Create(deviceId, DomainErrors.General.FailRequest(deviceId))
            .Map(request => new InactiveKioskCommand(request))
            .Bind(command => Mediator.Send(command))
            .Match(Ok, Failure);

    [Authorize(Policy = "Manager")]
    [HttpPatch("changePeripheralStatus")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ChangePeripheralStatus(string deviceId, string peripheralId, ActiveStatus status)
        => await Result.Create(deviceId, DomainErrors.General.FailRequest(deviceId))
            .Map(request => new ChangePeripheralStatusCommand(deviceId, peripheralId, status))
            .Bind(command => Mediator.Send(command))
            .Match(Ok, Failure);

    [Authorize(Policy = "Manager")]
    [HttpPatch("updatePeripheral")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdatePeripheral(string peripheralId, string deviceId, PeripheralRequest req)
        => await Result.Create(req, DomainErrors.General.UnProcessableRequest)
            .Map(request => new UpdatePeripheralCommand(peripheralId, deviceId, request))
            .Bind(command => Mediator.Send(command))
            .Match(Ok, Failure);

    [AllowAnonymous]
    [HttpPost("addProductsToDispenser")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> AddProductAsync(InventoryRequest req)
        => await Result.Create(req, DomainErrors.General.UnProcessableRequest)
            .Map(request => new AddQuantityIntoDispenserCommand(request.DeviceId,
                request.ProductId, request.Quantity, request.Slot))
            .Bind(command => Mediator.Send(command))
            .Match(Ok, Failure);

    [Authorize(Policy = "Manager")]
    [HttpGet("getKioskByGroupId")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetKioskByGroupAsync(string groupId, int page, int pageSize)
        => await Maybe<GetKiosksByGroupQuery>
            .From(new GetKiosksByGroupQuery(groupId, page, pageSize))
            .Bind(query => Mediator.Send(query))
            .Match(Ok, NotFound);

    [AllowAnonymous]
    [HttpPost("rebootKiosk")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> RebootKioskAsync(string deviceId)
        => await Result.Create(deviceId, DomainErrors.General.UnProcessableRequest)
            .Map(req => new RebootKioskByDeviceIdAction(deviceId))
            .Bind(command => Mediator.Send(command))
            .Match(Ok, Failure);
    [Authorize(Policy = "Manager")]
    [HttpPost("approveKiosk")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ApproveKioskAsync(string deviceId)
        => await Result.Create(deviceId, DomainErrors.General.UnProcessableRequest)
            .Map(req => new ApproveKioskWithDeviceIdCommand(deviceId))
            .Bind(command => Mediator.Send(command))
            .Match(Ok, Failure);
    [Authorize]
    [HttpGet("getPeripheralLog")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetSinglePeripheralLog(string deviceId, string? peripheralId = null, DateTime? from = null, DateTime? to = null)
        => await Maybe<GetPeripheralLogQuery>
        .From(new GetPeripheralLogQuery(deviceId, peripheralId, from, to))
        .Bind(query => Mediator.Send(query))
        .Match(Ok, NotFound);

    [Authorize]
    [HttpGet("getAllVideos")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAllVideos(int page, int pageSize, string? deviceId, DateTime from, DateTime to)
        => await Maybe<GetVideoListQuery>
            .From(new GetVideoListQuery(page, pageSize, deviceId, from, to))
            .Bind(async query => await Mediator.Send(query))
            .Match(Ok, NotFound);
    [Authorize]
    [HttpPost("openLockKiosk")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> OpenLocker(string? deviceId)
         => await Result.Create(deviceId, DomainErrors.General.UnProcessableRequest)
            .Map(req => new KioskLockerByDeviceIdAction(deviceId))
            .Bind(action => Mediator.Send(action))
            .Match(Ok, Failure);
    [Authorize]
    [HttpGet("reactiveKiosk")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ReactiveKiosk(string deviceId)
        => await Result.Create(deviceId, DomainErrors.General.UnProcessableRequest)
        .Map(req => new ReactiveKioskByDeviceIdAction(deviceId))
        .Bind(action => Mediator.Send(action))
        .Match(Ok, Failure);
    [Authorize]
    [HttpGet("refreshKiosk")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> RefreshKiosk(string deviceId)
        => await Result.Create(deviceId, DomainErrors.General.UnProcessableRequest)
        .Map(req => new RefreshKioskByDeviceIdAction(deviceId))
        .Bind(action => Mediator.Send(action))
        .Match(Ok, Failure);
}
