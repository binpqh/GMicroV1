using AsimKiosk.Application.Core.Abstractions.Cryptography;
using AsimKiosk.Application.Core.Abstractions.Notification;
using AsimKiosk.Application.Core.Common;
using AsimKiosk.Domain.Core.Abstractions;
using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Repositories;
using AsimKiosk.Infrastructure.Common.Authentication;
using AsimKiosk.Infrastructure.Common.Cryptography;
using AsimKiosk.Infrastructure.Common.Notifications;
using AsimKiosk.Infrastructure.Common.TimeUTC;
using AsimKiosk.Infrastructure.Persistence.Repositories;
using AsimKiosk.Infrastructure.Persistence;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using MongoFramework;
using AsimKiosk.Application.Core.Abstractions.AsimPaymentHub;
using AsimKiosk.Infrastructure.Common.PaymentHub;
using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Infrastructure.Common.File;
using AsimKiosk.Domain.Core.File;
using Microsoft.AspNetCore.Http;
using AsimKiosk.Application.Core.Abstractions.AsimPackageSim;
using AsimKiosk.Infrastructure.Common.PackageSim;

namespace AsimKiosk.Infrastructure;

public static class DependencyInjection
{
    public static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        //Database
        var mongoDbConnectionString = Environment.GetEnvironmentVariable("ConnectionStrings__MongoDb") ?? configuration.GetConnectionString("MongoDbURL");
        services.AddScoped<IMongoDbConnection>(s =>
            MongoDbConnection.FromUrl(new MongoUrl(mongoDbConnectionString)));
        services.AddScoped<IUnitOfWork, AsimDbContext>();
        //Repositories
        services.AddScoped<IExternalAPIRepository, ExternalAPIRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IGroupRepository, GroupRepository>();
        services.AddScoped<IPaymentRepository, PaymentRepository>();
        services.AddScoped<ILogPeripherals,LogPeripheralsRepository>();
        services.AddScoped<IMaintenanceRepository, MaintenanceRepository>();
        services.AddScoped<IPaymentConfigRepository, PaymentConfigRepository>();
        services.AddScoped<IKioskRepository, KioskRepository>();
        services.AddScoped<IExternalAPIRepository, ExternalAPIRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IPaymentMethodRepository, PaymentMethodRepository>();
        services.AddScoped<IBannerRepository, BannerRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<ILogRepository, LogRepository>();
        services.AddScoped<ICardStorageRepository, CardStorageRepository>();
        services.AddScoped<IWarehouseTicketRepository, WarehouseTicketRepository>();
        services.AddScoped<ILocalSimConfigRepository, LocalSimConfigRepository>();
        services.AddScoped<IVideoRepository, VideoRepository>();
        services.AddScoped<IInstructionVideoRepository, InstructionVideoRepository>();
        services.AddScoped<INotificationRepository,NotificationRepository>();
        //Infrac
        services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        //  services.AddSingleton<IUserIdentifierProvider, UserIdentifierProvider>();
        services.AddScoped<IUserIdentifierProvider, UserIdentifierProvider>();
        services.AddScoped<IKioskIdentifierProvider, KioskIdentifierProvider>();
        services.AddScoped<IDateTime, MachineDateTime>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IPasswordHashChecker, PasswordHasher>();
        services.AddScoped<IAuthKey, BasicAuthFactor>();
        services.AddScoped<IIntegrationEventInvoker, IntegrationEventInvoker>();
        services.AddScoped<IIntegrationPaymentHub, IntegrationPaymentHub>();
        services.AddScoped<IPackageSim, RegisterSimPackageAdapter>();
        services.AddScoped<IJwtProvider, JwtProvider>();
        services.AddScoped<IFileService, FileService>();
        services.AddHttpClient();
        services.AddLogging();
        //Websocket
        services.AddSignalR()
            .AddJsonProtocol(options =>
            {
                options.PayloadSerializerOptions.PropertyNamingPolicy = null;
            });


        // var serviceProvider = services.BuildServiceProvider();
        // var myClass = serviceProvider.GetRequiredService<RegisterSimPackageAdapter>();
        // var myClass2 = serviceProvider.GetRequiredService<ILocalSimConfigRepository>();

    }
}
