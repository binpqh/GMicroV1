using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Domain.Repositories;

public interface ICardStorageRepository
{
    Task<Maybe<EntityCollection<CardStorage>>> GetAllAsync();
    Task<(List<CardStorage>, int)> GetInventoryReportAsync(
        int page, int pageSize, List<string> itemCodes, List<string> deviceIds, StorageStatus status);
    (int, int, int, int, int) GetInventoryNumbers(List<string> itemCodes, List<string> deviceIds);
    Task<Maybe<CardStorage>> GetByDeviceIdAndSerialCardAsync(string deviceId, long serialCard);
    Task<List<CardStorage>> GetByKioskAsync(string kioskId, DateTime? from, DateTime? to);
    void Insert(CardStorage sim);
    void InsertRange(IReadOnlyCollection<CardStorage> SIMList);
    //void Update(CardStorage sim);
    Task RemoveAsync(CardStorage sim);
}
