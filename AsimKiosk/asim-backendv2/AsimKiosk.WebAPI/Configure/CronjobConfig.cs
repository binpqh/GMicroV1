using AsimKiosk.WebAPI.Cronjobs;
using Quartz;

namespace AsimKiosk.WebAPI.Configure
{
    public static class CronjobConfig
    {
        public static void ConfigureCronjob(this IServiceCollection services) 
        {
            services.AddQuartzHostedService(opt => opt.WaitForJobsToComplete = true);
            services.AddQuartz(opt =>
            {
                opt.SchedulerId = "MainScheduler";

                opt.UseSimpleTypeLoader();
                opt.UseInMemoryStore();
                opt.UseDefaultThreadPool(tp => { tp.MaxConcurrency = 10; });

                var jobKey = new JobKey("Get Local Sim token Job", "Default Group");
                opt.AddJob<GetLocalSimJob>(jobKey,
                    j => j.WithDescription(
                        "Get Local SIM token every 7 days."));

                opt.AddTrigger(t => t
                    .WithIdentity("7days")
                    .ForJob(jobKey)
                    .StartNow()
                    .WithCronSchedule(CronScheduleBuilder.WeeklyOnDayAndHourAndMinute(DayOfWeek.Sunday, 0, 0))
                    .WithDescription("Trigger at 12 AM every Sunday"));
            });

            services.AddTransient<GetLocalSimJob>();
        }
    }
}
