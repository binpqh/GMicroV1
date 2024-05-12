#pragma warning disable ASP0000 // Do not call 'IServiceCollection.BuildServiceProvider' in 'ConfigureServices'

using AsimKiosk.Application;
using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Application.Core.Startup;
using AsimKiosk.Infrastructure;
using AsimKiosk.Infrastructure.Common.Authentication;
using AsimKiosk.Infrastructure.Common.Mapping;
using AsimKiosk.WebAPI.Configure;
using AsimKiosk.WebAPI.Middleware;
using AsimKiosk.WebAPI.OptionsSetup;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.FileProviders;
using Microsoft.Net.Http.Headers;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();

// Configure Serilog to log to the console and MongoDB
builder.Logging.AddSerilog(dispose: true);

// Configure Serilog to log to MongoDB
Log.Logger = new LoggerConfiguration()
    .WriteTo.MongoDB(builder.Configuration["ConnectionStrings:MongoDbURL"]!, "SocketLog")
    .CreateLogger();

builder.Logging.AddConsole();
builder.Services.Configure<FormOptions>(options =>
{
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartBodyLengthLimit = int.MaxValue; // In case of multipart
    options.MemoryBufferThreshold = Int32.MaxValue;
});
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();


_ = Task.Run(async () =>
{
    using var scope = builder.Services.BuildServiceProvider().CreateScope();
    {
        var localSimService = scope.ServiceProvider.GetRequiredService<LocalSimService>();
        await localSimService.StartAsync(); // get token for current session
    }
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(o =>
{
    o.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 1safsfsdfdfd\"",
    });
    o.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                new string[] {}
        }
    });
    o.AddSecurityDefinition("Basic", new OpenApiSecurityScheme()
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Basic",
        In = ParameterLocation.Header,
        Description = "Basic auth header",
    });
    o.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Basic"
                    }
                },
                new string[] {}
        }
    });
});
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddHttpContextAccessor();
builder.Services.AddAuthentication(auth =>
{
    auth.DefaultAuthenticateScheme = "MultiAuthSchemes";
    auth.DefaultChallengeScheme = "MultiAuthSchemes";
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
})
.AddScheme<AuthenticationSchemeOptions, BasicAuthenticationProvider>("Basic", null)
.AddPolicyScheme("MultiAuthSchemes", JwtBearerDefaults.AuthenticationScheme, o =>
{
    o.ForwardDefaultSelector = context =>
    {
        var authorization = context.Request.Headers[HeaderNames.Authorization].ToString();
        if (!string.IsNullOrEmpty(authorization) && authorization.StartsWith("Bearer "))
        {
            return JwtBearerDefaults.AuthenticationScheme;
        }
        return "Basic";
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Manager", p => p.RequireRole("ManagerGroup", "Administrator", "Superman"));
});
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});
builder.Services.ConfigureCors();
builder.Services.ConfigureOptions<JwtOptionsSetup>();
builder.Services.ConfigureOptions<JwtBearerOptionsSetup>();
builder.Services.RegisterMapsterConfiguration();
builder.Services.ConfigureCronjob();
builder.Services.ConfigureAsposeCells();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    Environment.SetEnvironmentVariable("JwtOptions__Issuer", "http://103.107.182.5:9601");
    Environment.SetEnvironmentVariable("JwtOptions__Audience", "http://103.107.182.5:9601");
    Environment.SetEnvironmentVariable("JwtOptions__SecretKey", "zxVtR7rWPRdwNbbOQIfVOUMIcRwki8Jo");
}
else if (!app.Environment.IsDevelopment())
{
    Environment.SetEnvironmentVariable("JwtOptions__Issuer", "https://localhost:44304");
    Environment.SetEnvironmentVariable("JwtOptions__Audience", "https://localhost:44304");
    Environment.SetEnvironmentVariable("JwtOptions__SecretKey", "zxVtR7rWPRdwNbbOQIfVOUMIcRwki8Jo");
}
string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "Resources/Images");
if (!Directory.Exists(folderPath))
{
    Directory.CreateDirectory(folderPath);
}
string folderVideo = Path.Combine(Directory.GetCurrentDirectory(), "Resources/Videos");
if (!Directory.Exists(folderVideo))
{
    Directory.CreateDirectory(folderVideo);
}
string folderAssets = Path.Combine(Directory.GetCurrentDirectory(), "assets");
if (!Directory.Exists(folderAssets))
{
    Directory.CreateDirectory(folderAssets);
}
string documentsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Resources/Documents");
if (!Directory.Exists(documentsFolder))
{
    Directory.CreateDirectory(documentsFolder);
}
app.UseStaticFiles(
    new StaticFileOptions()
    {
        FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources/Images")),
        RequestPath = new PathString("/Resources/Images")
    });
app.UseStaticFiles(
    new StaticFileOptions()
    {
        FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources/Videos")),
        RequestPath = new PathString("/Resources/Videos")
    });
app.UseStaticFiles(
    new StaticFileOptions()
    {
        FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"assets")),
        RequestPath = new PathString("/assets")
    });
app.UseStaticFiles(
    new StaticFileOptions()
    {
        FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources/Documents")),
        RequestPath = new PathString("/Resources/Documents")
    });

app.UseForwardedHeaders();

app.UseSwagger();

app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "JWTAuthDemo v1"));

app.UseCustomExceptionHandler();

app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapHub<KioskHub>("/KioskHub", options =>
    {
        options.Transports = Microsoft.AspNetCore.Http.Connections.HttpTransportType.WebSockets |
            Microsoft.AspNetCore.Http.Connections.HttpTransportType.LongPolling;
    }
);


app.Run();



