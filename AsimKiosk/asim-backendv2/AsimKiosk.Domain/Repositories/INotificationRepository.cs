using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Repositories;

public interface INotificationRepository
{
    Task<Maybe<EntityCollection<Notification>>> GetAllAsync();
    Task<(List<Notification>,int)> GetAllByUser(string userId, string? groupId);
    Task<List<Notification>> GetNotificationsByListId(List<string> notificationIds);
    Task<Maybe<Notification>> GetByIdChild(string id);
    Task<bool> IsDuplicateAsync(string? groupId, string idNavigateChild, string parentNavigate);
    void Insert(Notification banner);
    Task RemoveAsync(Notification banner);
}
