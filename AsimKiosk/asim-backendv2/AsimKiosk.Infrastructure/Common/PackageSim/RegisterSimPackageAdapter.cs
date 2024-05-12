using AsimKiosk.Application.Core.Abstractions.AsimPackageSim;
using AsimKiosk.Contracts.LocalSimApi;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Repositories;
using AsimKiosk.Infrastructure.Persistence.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace AsimKiosk.Infrastructure.Common.PackageSim;

internal class RegisterSimPackageAdapter(
    ILogger<RegisterSimPackageAdapter> _logger,
    ILocalSimConfigRepository localSimConfigRepository,
    IConfiguration _configuration)
    : IPackageSim
{
    public async Task<bool> Register(
        string serialSim,
        string dataPacket,
        string transNo,
        string storeCode)
    {
        var localsimConfig = await localSimConfigRepository.GetActiveConfigAsync();
        var baseUrl = localsimConfig.HasValue ? localsimConfig.Value.BussUrl : _configuration["LocalSimHost:RequestUrl"] ?? "https://api-lcs-stg.asimgroup.vn";
        //var baseUrl = _configuration["LocalSimHost:RequestUrl"] ?? "https://api-lcs-stg.asimgroup.vn";
        var token = Environment.GetEnvironmentVariable("SIM_TOKEN");
        var url = Endpoints.Register;
        var body = new
        {
            appid = "Kiosk",
            serialNumber = serialSim,
            transactionCode = transNo,
            storeCode = storeCode ?? "1003",
            dataPacket = dataPacket
        };
        var jsonBody = JsonSerializer.Serialize(body);
        var requestBody = new StringContent(jsonBody, Encoding.UTF8, "application/json");
        var httpRequest = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Headers =
            {
               { "accept", "text/plain" },
               { "Authorization", $"Bearer {token}" }
            },
            Content = requestBody
        };
        using var httpClient = new HttpClient();
        httpClient.BaseAddress = new Uri(baseUrl);
        var res = await httpClient.SendAsync(httpRequest);
        if (res.IsSuccessStatusCode)
        {
            var jsonContent = await res.Content.ReadAsStringAsync();
            var parseData = JsonSerializer.Deserialize<RegisterSimLocalResponse>(jsonContent);
            if (parseData?.State == 0)
            {
                return true;
            }
            _logger.LogError("[PACKAGE SIM] Failed to register sim ...");
            _logger.LogError(parseData?.Message);

            return false;
        }

        _logger.LogError("[PACKAGE SIM] Error when calling api register sim with http status: " + res.StatusCode);
        return false;
    }

    public async Task<Task> GetTokenAsync(GetTokenRequest request, int CURRENT_RETRY = 0, int MAX_RETRY = 3)
    {
        var localsimConfig = await localSimConfigRepository.GetActiveConfigAsync();
        var baseUrl = localsimConfig.HasValue ? localsimConfig.Value.AuthUrl : _configuration["LocalSimHost:BaseUrl"] ?? "http://10.252.33.51:8080";
        if (CURRENT_RETRY == MAX_RETRY)
        {
            _logger.LogError("[PACKAGE SIM] Cannot get token from local sim api");
            throw new HttpRequestException("Can't get token from local sim api");
        }

        var endPoint = Endpoints.GetTokenUrl(request.Realm);

        var httpRequest = new HttpRequestMessage(HttpMethod.Post, endPoint)
        {
            Headers =
            {
                {HeaderNames.Accept,"application/x-www-form-urlencoded"}
            },
            Content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("username", request.UserName),
                new KeyValuePair<string, string>("password", request.Password),
                new KeyValuePair<string, string>("grant_type", request.GrantType),
                new KeyValuePair<string, string>("client_id", request.ClientId),
                new KeyValuePair<string, string>("client_secret", request.ClientSecret),
                new KeyValuePair<string, string>("scope", request.Scope),
            })
        };
        var jsonReq = JsonSerializer.Serialize(request);
        using var httpClient = new HttpClient();
        httpClient.BaseAddress = new Uri(baseUrl);
        _logger.LogInformation($"[PACKAGE SIM] Get token from local sim api: {baseUrl}, {jsonReq}");
        var res = await httpClient.SendAsync(httpRequest);
        if (!res.IsSuccessStatusCode)
        {
            CURRENT_RETRY += 1;
            _logger.LogWarning($"[PACKAGE SIM] Retrying to get token ... {CURRENT_RETRY}");

            await Task.Delay(60000 * CURRENT_RETRY);
            return await GetTokenAsync(request, CURRENT_RETRY);
        }
        var jsonString = await res.Content.ReadAsStringAsync();

        var result = JsonSerializer.Deserialize<GetTokenResponse>(jsonString ?? "{}");
        if (result?.AccessToken != null)
        {
            _logger.LogInformation("[PACKAGE SIM] Set token to env.");
            Environment.SetEnvironmentVariable("SIM_TOKEN", result.AccessToken);

        }
        _logger.LogInformation(Environment.GetEnvironmentVariable("SIM_TOKEN"));
        return Task.CompletedTask;
    }

    public async Task<IEnumerable<GetPackageRespone>> GetPackagesAsync()
    {
        var localsimConfig = await localSimConfigRepository.GetActiveConfigAsync();
        var baseUrl = localsimConfig.HasValue ? localsimConfig.Value.BussUrl : _configuration["LocalSimHost:RequestUrl"] ?? "https://api-lcs-stg.asimgroup.vn";
        var token = Environment.GetEnvironmentVariable("SIM_TOKEN");
        var endPoint = Endpoints.GetPackages;
        var httpRequest = new HttpRequestMessage(HttpMethod.Get, endPoint)
        {
            Headers =
            {
                { "accept", "text/plain" },
                { "Authorization", $"Bearer {token}" }
            }
        };

        using var httpClient = new HttpClient();
        httpClient.BaseAddress = new Uri(baseUrl);
        var response = await httpClient.SendAsync(httpRequest);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Can't get package from local sim api");
            return [];
        };

        var jsonString = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<GetPackageRespone[]>(jsonString ?? "[]");
        return result ?? [];
    }
}
