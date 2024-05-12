using AsimKiosk.Application.Core.Features.Order.Queries.GetOrderLog;
using AsimKiosk.Application.Core.Features.Order.Query.DropdownSearch;
using AsimKiosk.Application.Core.Features.Order.Query.GetAllOrders;
using AsimKiosk.Application.Core.Features.Order.Query.GetOrderByOrderCode;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.WebAPI.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AsimKiosk.WebAPI.Controllers;

public class OrderController(IMediator mediator) : APIController(mediator)
{
    [Authorize(Policy = "Manager")]
    [HttpGet]
    [Route("get")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOrderByOrderCodeAsync(string orderCode)
        => await Maybe<GetOrderByOrderCodeQuery>.From(new GetOrderByOrderCodeQuery(orderCode))
        .Bind(query => Mediator.Send(query))
        .Match(Ok, NotFound);
     
    //[Authorize(Policy = "Manager")]
    //[HttpGet]
    //[Route("getPaginate")]
    //[ProducesResponseType(StatusCodes.Status200OK)]
    //public async Task<IActionResult> GetPaginateOrder(int pageNumer, int pageSize, string? deviceId, DateTime dateFrom, DateTime dateTo)
    //    => await Maybe<GetAllOrdersQuery>.From(new GetAllOrdersQuery(pageNumer, pageSize, deviceId, dateFrom, dateTo))
    //    .Bind(query => Mediator.Send(query))
    //    .Match(Ok, NotFound);

    [AllowAnonymous]
    [HttpGet("logs")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPackageAsync(string orderId)
        => await Maybe<GetOrderLogQuery>.From(new GetOrderLogQuery(orderId))
        .Bind(query => Mediator.Send(query))
        .Match(Ok, NotFound);

    [Authorize]
    [HttpGet("search")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DropdownSearch(string queryString, int number)
        => await Maybe<DropdownSearchQuery>.From(new DropdownSearchQuery(queryString, number))
        .Bind(async query => await Mediator
        .Send(query)).Match(Ok, NotFound);
}
