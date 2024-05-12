using AsimKiosk.Application.Core.Abstractions.AsimPaymentHub;
using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Contracts.Payment;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace AsimKiosk.Application.Core.Common
{
    public class SpamPOSResult(CheckPayRequest req, IServiceScopeFactory serviceScopeFactory) : BackgroundService
    {
        private CheckPayRequest _checkPayRequest = req;
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using IServiceScope scope = serviceScopeFactory.CreateScope();

            var integrationPaymentHub = scope
                .ServiceProvider
                .GetRequiredService<IIntegrationPaymentHub>();
            var kioskHub = scope
                .ServiceProvider
                .GetRequiredService<IKioskHub>();
            int count = 0;
            while (count < 40)
            {
                var resTrans = await integrationPaymentHub.CheckResultAsync(_checkPayRequest, stoppingToken);
                if (resTrans is { IsSuccess: true, Value.Value: "00" })
                {
                    await kioskHub.NotifyResultTransaction(_checkPayRequest.DeviceId, _checkPayRequest.OrderCode, _checkPayRequest.TransNo, true);
                    break;
                }
                count++;
                await Task.Delay(2000, stoppingToken);
                if(count == 40)
                {
                  await kioskHub.NotifyResultTransaction(_checkPayRequest.DeviceId, _checkPayRequest.OrderCode, _checkPayRequest.TransNo, false);
                }
            }
            scope.Dispose();
        }
    }
}
