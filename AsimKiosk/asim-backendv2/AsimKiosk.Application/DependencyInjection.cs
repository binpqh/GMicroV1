using AsimKiosk.Application.Core.Behaviors;
using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Application.Core.Startup;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace AsimKiosk.Application;

public static class DependencyInjection
{
    public static void AddApplication(this IServiceCollection services)
    {
        var assembly = typeof(DependencyInjection).Assembly;
        services.AddValidatorsFromAssembly(assembly);
        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssembly(assembly);
            config.AddOpenBehavior(typeof(UnitOfWorkBehavior<,>));
            config.AddOpenBehavior(typeof(ValidationBehaviour<,>));
        });

        services.AddScoped<IKioskHub, KioskHub>();
        // services.AddSignalR();
        services.AddScoped<LocalSimService>();

    }
}
