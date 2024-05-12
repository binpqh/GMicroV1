using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Repositories;
using AsimKiosk.Domain.ValueObject;
using AsimKiosk.Infrastructure.Persistence.Specifications;
using MongoFramework.Linq;

namespace AsimKiosk.Infrastructure.Persistence.Repositories;
internal class KioskRepository(IUnitOfWork unitOfWork) : GenericRepository<Kiosk>(unitOfWork), IKioskRepository
{
    public async Task<int> CountInGroupAsync(string groupId)
        => await UnitOfWork.Set<Kiosk>().CountAsync(g => g.GroupId == groupId);
    public async Task<Maybe<Kiosk>> GetActiveKioskByAndroidIdAsync(string deviceId)
        => await UnitOfWork.Set<Kiosk>()
        .Where(k => k.DeviceId == deviceId && k.Status == Domain.Enums.ActiveStatus.Active.ToString())
        .FirstOrDefaultAsync();
    public async Task<Maybe<Kiosk>> GetKioskAndroidIdAsync(string deviceId)
        => await UnitOfWork.Set<Kiosk>()
        .Where(k => k.DeviceId == deviceId)
        .FirstOrDefaultAsync();

    public async Task<List<Kiosk>> GetByGroupIdAsync(string groupId)
    => await UnitOfWork.Set<Kiosk>().Where(k => k.GroupId == groupId).ToListAsync();

    public async Task<Maybe<Kiosk>> GetByNameAsync(string name)
        => await UnitOfWork.Set<Kiosk>()
        .FirstOrDefaultAsync(k => k.KioskName == name);

    public async Task<Maybe<Inventory>> GetInventoryByDeviceIdAndNumberSlotAsync(string deviceId, string itemCode, int slotNumber)
        => await UnitOfWork.Set<Kiosk>().Where(k => k.DeviceId == deviceId)
        .Select(k => k.Inventories.First(i => i.ItemCode == itemCode && i.DispenserSlot == slotNumber)).FirstOrDefaultAsync();

    public async Task<List<Inventory>> GetInventoriesKioskItemProductAsync(string deviceId, string itemCode)
        => await UnitOfWork.Set<Kiosk>()
                .Where(k => k.DeviceId == deviceId)
                .SelectMany(k => k.Inventories)
                .Where(i => i.ItemCode == itemCode)
                .ToListAsync();

    public async Task<(int?, string?)> GetInvalidSlotItemAsync(string deviceId, int slot, string itemCode)
    {
        var inventory = await UnitOfWork.Set<Kiosk>()
           .Where(k => k.DeviceId == deviceId)
           .Select(k => k.Inventories.Where(i => i.DispenserSlot == slot && i.ItemCode == itemCode)).FirstOrDefaultAsync();
        if (inventory == null)
        {
            return (slot, itemCode);
        }
        return (null, null);
    }

    public async Task<bool> IsKioskExistWithDeviceIdAsync(string deviceId) => await AnyAsync(new KioskExistSpecification(deviceId));

    public async Task<bool> IsKioskExistWithName(string name)
        => await AnyAsync(new KioskWithNameSpecification(name));

    public async Task<(int, bool)> IsSlotEnoughOfProductsAsync(string deviceId, int slot, int quantity)
    {
        var inventoryQuantity = await UnitOfWork.Set<Kiosk>()
        .Where(k => k.DeviceId == deviceId)
        .Select(k => k.Inventories.First(i => i.DispenserSlot == slot))
        .FirstAsync();
        bool isEnough = inventoryQuantity.InventoryQuantity + quantity <= 250;
        int numAvailable = 250 - inventoryQuantity.InventoryQuantity;
        return (numAvailable, isEnough);
    }

    public async Task<bool> IsKioskContainItemAsync(string deviceId, string itemCode)
        => await UnitOfWork.Set<Kiosk>().AnyAsync(k => k.DeviceId == deviceId && k.Inventories.Any(i => i.ItemCode == itemCode));

    public async Task<(List<Kiosk>, int)> GetPaginateAsync(int pageSize, int pageNumber, string? groupId)
    {
        if (!string.IsNullOrEmpty(groupId))
        {
            return (await UnitOfWork.Set<Kiosk>().Where(k => k.GroupId == groupId).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync(),
            await UnitOfWork.Set<Kiosk>().CountAsync());
        }
        else
        {
            return (await UnitOfWork.Set<Kiosk>().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync(),
            await UnitOfWork.Set<Kiosk>().CountAsync());
        }
    }

    public (int, int, int) GetInventoryNumbers(List<string> itemCodes, List<string> deviceIds)
    {
        var query = UnitOfWork.Set<Kiosk>().AsQueryable();

        if (deviceIds.Count > 0) query = query.Where(k => deviceIds.Contains(k.DeviceId));
        
        var inStorageCardCount = query.SelectMany(k => k.Inventories).Where(i => itemCodes.Contains(i.ItemCode)).Sum(i => i.InventoryQuantity);
        var errorCardCount = query.SelectMany(k => k.Inventories).Where(i => itemCodes.Contains(i.ItemCode)).Sum(i => i.ErrorQuantity);
        var totalCardCount = inStorageCardCount + errorCardCount;

        return (totalCardCount, inStorageCardCount, errorCardCount);
    }
}