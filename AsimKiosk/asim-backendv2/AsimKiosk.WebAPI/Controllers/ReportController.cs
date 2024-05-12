using AsimKiosk.Application.Core.Features.Report.Queries.Inventory.GetInventoryReport;
using AsimKiosk.Application.Core.Features.Report.Queries.Order.GetOrderReport;
using AsimKiosk.Contracts.Report;
using AsimKiosk.Domain.Core.Primitives;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AsimKiosk.WebAPI.Controllers;

public class ReportController(IMediator mediator) : APIController(mediator)
{
    [Authorize(Policy = "Manager")]
    [HttpPost("getOrderReport")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetOrderReport(int page, int pageSize, [FromBody] ReportRequest request)
        => await Maybe<GetOrderReportQuery>.From(new GetOrderReportQuery(page, pageSize, request))
                .Bind(async query => await Mediator.Send(query))
                .Match(Ok, NotFound);

    [Authorize]
    [HttpPost("getInventoryReport")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetInventoryReport(int page, int pageSize, [FromBody] InventoryReportRequest request)
        => await Maybe<GetInventoryReportQuery>.From(new GetInventoryReportQuery(page, pageSize, request))
                .Bind(async query => await Mediator.Send(query))
                .Match(Ok, NotFound);
}
