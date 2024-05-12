using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.WebAPI.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace AsimKiosk.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public abstract class APIController(IMediator mediator) : ControllerBase
{
    private ISender _mediator = mediator;
    protected ISender Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>();
    /// <summary>
    /// Creates an <see cref="BadRequestObjectResult"/> that produces a <see cref="StatusCodes.Status400BadRequest"/>.
    /// response based on the specified <see cref="Result"/>.
    /// </summary>
    /// <param name="error">The error.</param>
    /// <returns>The created <see cref="BadRequestObjectResult"/> for the response.</returns>
    protected IActionResult BadRequest(Error error) => BadRequest(new APIErrorResponse(HttpStatusCode.BadRequest.ToString(),new Dictionary<string, string> { { error.Code,error.Message } }));

    /// <summary>
    /// Creates an <see cref="OkObjectResult"/> that produces a <see cref="StatusCodes.Status200OK"/>.
    /// </summary>
    /// <returns>The created <see cref="OkObjectResult"/> for the response.</returns>
    /// <returns></returns>
    protected new IActionResult Ok(object value) => base.Ok(new APIResponse(value));
    protected new IActionResult Ok() => base.Ok(new APIResponse());
    /// <summary>
    /// Creates an <see cref="NotFoundResult"/> that produces a <see cref="StatusCodes.Status404NotFound"/>.
    /// </summary>
    /// <returns>The created <see cref="NotFoundResult"/> for the response.</returns>
    protected new IActionResult NotFound() => base.NotFound(new APIErrorResponse("The object with propery/identifier was not found.", new Dictionary<string, string> { { DomainErrors.General.NotFoundObject.Code, DomainErrors.General.NotFoundObject.Message } }));

    protected IActionResult Failure(Error error)
    {
        if(error.Type == Domain.Enums.ErrorType.NotFound)
        {
            return base.NotFound(new APIErrorResponse(HttpStatusCode.NotFound.ToString(), new Dictionary<string, string> { { error.Code, error.Message } }));
        }
        return UnprocessableEntity(new APIErrorResponse(HttpStatusCode.UnprocessableContent.ToString(), new Dictionary<string, string> { { error.Code, error.Message } }));
    }
}