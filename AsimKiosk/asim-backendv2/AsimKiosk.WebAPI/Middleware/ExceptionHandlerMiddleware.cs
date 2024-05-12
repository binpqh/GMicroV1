using AsimKiosk.Application.Core.Common;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Exceptions;
using AsimKiosk.WebAPI.Contracts;
using System.Net;
using System.Text.Json;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using System;

namespace AsimKiosk.WebAPI.Middleware;

/// <summary>
/// Represents the exception handler middleware.
/// </summary>
internal class ExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlerMiddleware> _logger;
    //private readonly ILogRepository _logRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="ExceptionHandlerMiddleware"/> class.
    /// </summary>
    /// <param name="next">The delegate pointing to the next middleware in the chain.</param>
    /// <param name="logger">The logger.</param>
    /// <param name="logRepository"></param>
    public ExceptionHandlerMiddleware(RequestDelegate next, ILogger<ExceptionHandlerMiddleware> logger/* ILogRepository logRepository*/)
    {
        _next = next;
        _logger = logger;
        //_logRepository = logRepository;
    }

    /// <summary>
    /// Invokes the exception handler middleware with the specified <see cref="HttpContext"/>.
    /// </summary>
    /// <param name="httpContext">The HTTP httpContext.</param>
    /// <returns>The task that can be awaited by the next middleware.</returns>
    public async Task Invoke(HttpContext httpContext)
    {
        var originalBodyStream = httpContext.Response.Body;

        using var responseBody = new MemoryStream();
        httpContext.Response.Body = responseBody;
        try
        {
            await _next(httpContext);
            if (httpContext.Response.StatusCode > 400 && httpContext.Response.StatusCode != 422)
            {
                await HandleErrorResponse(httpContext);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An exception occurred: {Message}", ex.Message);
            //_logRepository.Insert(new Log
            //{
            //    Type = ClientType.System.ToString(),
            //    DeviceId = "SYS01",
            //    UrlAPI = string.Empty,
            //    JsonData = ex.StackTrace?.ToString() ?? string.Empty,
            //    Desc = ex.Message
            //});
            await HandleExceptionAsync(httpContext, ex);
        }
        finally
        {
            responseBody.Seek(0, SeekOrigin.Begin);
            await responseBody.CopyToAsync(originalBodyStream);
            httpContext.Response.Body = originalBodyStream;
        }
    }

    /// <summary>
    /// Handles the specified <see cref="Exception"/> for the specified <see cref="HttpContext"/>.
    /// </summary>
    /// <param name="httpContext">The HTTP httpContext.</param>
    /// <param name="exception">The exception.</param>
    /// <returns>The HTTP response that is modified based on the exception.</returns>
    private static async Task HandleExceptionAsync(HttpContext httpContext, Exception exception)
    {
        var (httpStatusCode, errors, message) = GetHttpStatusCodeAndErrors(exception);

        httpContext.Response.ContentType = "application/json";

        httpContext.Response.StatusCode = (int)httpStatusCode;

        var serializerOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        var response = JsonSerializer.Serialize(new APIErrorResponse(
            message, errors), serializerOptions);

        await httpContext.Response.WriteAsync(response);
    }

    private static (HttpStatusCode httpStatusCode, IDictionary<string, string>,string) GetHttpStatusCodeAndErrors(Exception exception) =>
        exception switch
        {
            ValidationException validationException => (HttpStatusCode.BadRequest, validationException.Errors.ToDictionary(e=> e.Code, e=>e.Message),validationException.Message),

            DomainException domainException => (HttpStatusCode.BadRequest, new Dictionary<string, string>{{ domainException.Error.Code, domainException.Error.Message }},domainException.Message),
            _ => (HttpStatusCode.InternalServerError, new Dictionary<string, string> { { DomainErrors.General.ServerError.Code, DomainErrors.General.ServerError.Message}}, "Internal Server Error")
        };
    private async Task HandleErrorResponse(HttpContext context)
    {
        var statusCodeDescription = ((HttpStatusCode)context.Response.StatusCode).ToString();
        var statusCode = context.Response.StatusCode;
        var errorResponse = new APIErrorResponse(StringHelper.AddSpaceBeforeUpperCase(statusCodeDescription), new Dictionary<string, string> { { context.Response.StatusCode.ToString(), StringHelper.AddSpaceBeforeUpperCase(statusCodeDescription) } });
        context.Response.Clear();
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;
        var serializerOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
        var response = JsonSerializer.Serialize(errorResponse, serializerOptions);
        await context.Response.WriteAsync(response);
    }
}

/// <summary>
/// Contains extension methods for configuring the exception handler middleware.
/// </summary>
internal static class ExceptionHandlerMiddlewareExtensions
{
    /// <summary>
    /// Configure the custom exception handler middleware.
    /// </summary>
    /// <param name="builder">The application builder.</param>
    /// <returns>The configured application builder.</returns>
    internal static IApplicationBuilder UseCustomExceptionHandler(this IApplicationBuilder builder)
        => builder.UseMiddleware<ExceptionHandlerMiddleware>();
}

