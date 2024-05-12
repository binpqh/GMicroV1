using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.ValueObject;

namespace AsimKiosk.Domain.Repositories
{
    public interface IKioskRepository
    {
        Task<int> CountInGroupAsync(string groupId);
        Task<Maybe<EntityCollection<Kiosk>>> GetAllAsync();
        Task<(List<Kiosk>, int)> GetPaginateAsync(int pageSize, int pageNumber, string? groupId);
        Task<Maybe<Kiosk>> GetActiveKioskByAndroidIdAsync(string deviceId);
        Task<Maybe<Kiosk>> GetKioskAndroidIdAsync(string deviceId);
        Task<List<Kiosk>> GetByGroupIdAsync(string groupId);
        Task<bool> IsKioskExistWithDeviceIdAsync(string deviceId);
        Task<bool> IsKioskContainItemAsync(string deviceId,string itemCode);
        Task<Maybe<Inventory>> GetInventoryByDeviceIdAndNumberSlotAsync(string deviceId, string itemCode, int slotNumber);
        Task<List<Inventory>> GetInventoriesKioskItemProductAsync(string deviceId, string itemCode);
        Task<(int?, string?)> GetInvalidSlotItemAsync(string deviceId, int slot, string itemCode);
        Task<(int, bool)> IsSlotEnoughOfProductsAsync(string deviceId, int slot, int quantity);
        (int, int, int) GetInventoryNumbers(List<string> itemCodes, List<string> deviceIds);
        void Insert(Kiosk kiosk);
        Task RemoveAsync(Kiosk kiosk);
        void UpdateRange(IReadOnlyCollection<Kiosk> kiosk);
    }
}
