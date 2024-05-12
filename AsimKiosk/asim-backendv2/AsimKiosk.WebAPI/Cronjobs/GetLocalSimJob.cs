using AsimKiosk.Application.Core.Startup;
using Quartz;

namespace AsimKiosk.WebAPI.Cronjobs
{
    public class GetLocalSimJob(LocalSimService service) : IJob
    {
        public async Task Execute(IJobExecutionContext context)
        {
            await service.UpdateTokenAsync();
        }
    }
}
