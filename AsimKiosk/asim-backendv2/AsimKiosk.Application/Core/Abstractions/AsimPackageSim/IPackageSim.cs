using AsimKiosk.Contracts.LocalSimApi;

namespace AsimKiosk.Application.Core.Abstractions.AsimPackageSim;

public interface IPackageSim
{
    Task<bool> Register(string serialSim, string dataPacket, string transNo, string storeCode);
    Task<Task> GetTokenAsync(GetTokenRequest request, int CURRENT_RETRY = 0, int MAX_RETRY = 3);
    Task<IEnumerable<GetPackageRespone>> GetPackagesAsync();
}