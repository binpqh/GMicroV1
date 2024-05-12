

using AsimKiosk.Application.Core.Abstractions.AsimPackageSim;
using AsimKiosk.Application.Core.Common;
using AsimKiosk.Application.Core.Features.LocalSimAPIs.Queries.GetConfig;
using AsimKiosk.Contracts.LocalSimApi;
using Mapster;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AsimKiosk.Application.Core.Startup;
public class LocalSimService(
    ILogger<LocalSimService> logger,
    IPackageSim packageSim,
    IMediator mediator
    )
{
    public async Task StartAsync()
    {
        try
        {
            logger.LogInformation("Web API has started. Running background code...");

            await GetLocalSimTokenAsync();

            logger.LogInformation("Background code execution complete.");

        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);
        }
    }

    public async Task UpdateTokenAsync()
    {
        try
        {
            logger.LogInformation("Updating Local Sim token. Running background code...");

            await GetLocalSimTokenAsync();

            logger.LogInformation("Background code execution complete.");

        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);
        }
    }

    private async Task GetLocalSimTokenAsync()
    {
        var config = await mediator.Send(new GetActiveConfigLocalSimQuery());
        logger.LogInformation("Get local sim config successfully");

        var tokenReq = config.Value.Adapt<GetTokenRequest>();

        logger.LogInformation("Binding to get token request ... ");

        await packageSim.GetTokenAsync(tokenReq);

    }
}
