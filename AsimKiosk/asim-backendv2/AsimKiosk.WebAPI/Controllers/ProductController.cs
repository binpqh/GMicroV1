using AsimKiosk.Application.Core.Features.LocalSimAPIs.Queries.GetPackageSim;
using AsimKiosk.Application.Core.Features.Products.Command.AddItemsIntoProduct;
using AsimKiosk.Application.Core.Features.Products.Command.AddProductBanners;
using AsimKiosk.Application.Core.Features.Products.Command.ChangePriorityBanners;
using AsimKiosk.Application.Core.Features.Products.Command.ChangeStatusProductBanners;
using AsimKiosk.Application.Core.Features.Products.Command.CreateProduct;
using AsimKiosk.Application.Core.Features.Products.Command.RemoveItemFromProduct;
using AsimKiosk.Application.Core.Features.Products.Command.RemoveProductByCode;
using AsimKiosk.Application.Core.Features.Products.Command.UpdateItemsInProduct;
using AsimKiosk.Application.Core.Features.Products.Command.UpdateProductByCode;
using AsimKiosk.Application.Core.Features.Products.Command.UpdateStateItemCommand;
using AsimKiosk.Application.Core.Features.Products.Query.GetAllProducts;
using AsimKiosk.Application.Core.Features.Products.Query.GetBanners;
using AsimKiosk.Application.Core.Features.Products.Query.GetProductCodeDropdown;
using AsimKiosk.Application.Core.Features.Products.Query.GetProductDetail;
using AsimKiosk.Contracts.Product;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.WebAPI.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AsimKiosk.WebAPI.Controllers;

[Authorize(Policy = "Manager")]
public class ProductController(IMediator mediator) : APIController(mediator)
{
    [HttpGet("sim/packages")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPackageAsync()
        => await Maybe<GetPackageSimQuery>.From(new GetPackageSimQuery())
        .Bind(query => Mediator.Send(query))
        .Match(Ok, NotFound);

    //[KioskAuthorized]
    [HttpGet("all")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAllAsync()
        => await Maybe<GetAllProductsQuery>.From(new GetAllProductsQuery())
        .Bind(query => Mediator.Send(query))
        .Match(Ok, NotFound);

    [HttpGet("get")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByProductCodeAsync(string productCode)
        => await Maybe<GetProductDetailQuery>.From(new GetProductDetailQuery(productCode))
        .Bind(query => Mediator.Send(query))
        .Match(Ok, NotFound);

    [HttpPost("create")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateProductAsync([FromForm] ProductRequest req)
        => await Result.Create(req, DomainErrors.General.UnProcessableRequest)
            .Map(request => new CreateProductCommand(request))
            .Bind(command => Mediator.Send(command))
            .Match(Ok, Failure);

    [HttpPut("update")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateProductAsync([FromForm] UpdateProductOnlyRequest req, string productCode)
        => await Result.Create(req, DomainErrors.General.UnProcessableRequest)
        .Map(request => new UpdateProductByCodeCommand(productCode, request))
        .Bind(command => Mediator.Send(command))
        .Match(Ok, Failure);

    [HttpDelete("remove")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RemoveProductByCodeAsync(string productCode)
        => await Result.Create(productCode, DomainErrors.General.UnProcessableRequest)
        .Map(req => new RemoveProductByCodeCommand(productCode))
        .Bind(command => Mediator.Send(command))
        .Match(Ok, Failure);


    [HttpPost("addItems")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddItemIntoProduct(string productCode, [FromForm] AddItemsRequest items)
        => await Result.Create(productCode, DomainErrors.General.UnProcessableRequest)
        .Map(request => new AddItemIntoProductCommand(productCode, items))
        .Bind(command => Mediator.Send(command))
        .Match(Ok, Failure);

    [HttpPut("updateItems")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateItemsInProduct(string productCode, [FromForm] UpdateItemsRequest items)
        => await Result.Create(productCode, DomainErrors.General.UnProcessableRequest)
        .Map(request => new UpdateItemsInProductCommand(productCode, items))
        .Bind(command => Mediator.Send(command))
        .Match(Ok, Failure);

    [HttpDelete("removeItem")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RemoveItemFromProduct(string productCode, string itemCode)
        => await Result.Create(productCode, DomainErrors.General.UnProcessableRequest)
        .Map(request => new RemoveItemFromProductCommand(productCode, itemCode))
        .Bind(command => Mediator.Send(command))
        .Match(Ok, Failure);

    [HttpPut("update-item-state")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> UpdateItemState(string productCode, string itemCode, bool isActive)
        => await Result.Create(productCode, DomainErrors.General.UnProcessableRequest)
        .Map(request => new UpdateStateItemCommand(productCode, itemCode, isActive))
        .Bind(command => Mediator.Send(command))
        .Match(Ok, Failure);

    [HttpPost("addBanners")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddProductBannersAsync([FromForm] List<IFormFile> banners)
        => await Result.Create(banners, DomainErrors.General.UnProcessableRequest)
        .Map(request => new AddProductBannersCommand(banners))
        .Bind(command => Mediator.Send(command))
        .Match(Ok, Failure);

    [HttpGet("banners")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetBannersAsync()
        => await Maybe<GetBannersQuery>.From(new GetBannersQuery())
            .Bind(command => Mediator.Send(command))
            .Match(Ok, NotFound);

    [HttpGet("dropdownProductCode")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProductCodes()
        => await Maybe<GetProductCodeDropdownQuery>.From(new GetProductCodeDropdownQuery())
            .Bind(command => Mediator.Send(command))
            .Match(Ok, NotFound);

    [HttpPost("changePriorityBanners")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangePrioriry(List<ChangePriorityRequest> banners)
        => await Result.Create(banners, DomainErrors.General.UnProcessableRequest)
        .Map(request => new ChangePriorityBannersCommand(banners))
        .Bind(command => Mediator.Send(command))
        .Match(Ok, Failure);

    [HttpPost("changeStatusBanners")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(APIErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangeStatusBanner(string imgKey, ActiveStatus activeStatus)
        => await Result.Create(imgKey, DomainErrors.General.UnProcessableRequest)
        .Map(request => new ChangeStatusProductBannersCommand(imgKey, activeStatus))
        .Bind(command => Mediator.Send(command))
        .Match(Ok, Failure);
}