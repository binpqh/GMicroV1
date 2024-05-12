using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Repositories;
using MongoDB.Bson;
using MongoFramework.Linq;

namespace AsimKiosk.Infrastructure.Persistence.Repositories;

internal class NotificationRepository(IUnitOfWork unitOfWork) : GenericRepository<Notification>(unitOfWork), INotificationRepository
{
    public async Task<(List<Notification>,int)> GetAllByUser(string userId, string? groupId)
    {
        if(groupId is null)
        {

            return (await UnitOfWork.Set<Notification>()
                .OrderByDescending(n => n.CreateAt)
            .ToListAsync(),await UnitOfWork.Set<Notification>().CountAsync(n => !n.UserMarkedAsRead.Any(u => u == userId)));
        }
        return (await UnitOfWork.Set<Notification>()
            .OrderByDescending(n => n.CreateAt)
            .Where(n => n.GroupId == groupId)
            .ToListAsync(),await UnitOfWork.Set<Notification>().CountAsync(n => !n.UserMarkedAsRead.Any(u => u == userId)));
    }

    public async Task<Maybe<Notification>> GetByIdChild(string id)
        => await UnitOfWork.Set<Notification>().FirstOrDefaultAsync(n => n.IdNavigateChild == id);

    public async Task<List<Notification>> GetNotificationsByListId(List<string> notificationIds)
    {
        List<ObjectId> objectIds = new();
        notificationIds.ForEach(n =>
        {
            objectIds.Add(ObjectId.Parse(n));
        });
        var newestNoti = await UnitOfWork.Set<Notification>().OrderByDescending(n => n.CreateAt).FirstOrDefaultAsync();
        var res = await UnitOfWork.Set<Notification>().WhereIdMatches(objectIds).ToListAsync();
        res.Add(newestNoti);
        return res;
    }

    public async Task<bool> IsDuplicateAsync(string? groupId, string idNavigateChild, string parentNavigate)
        => await UnitOfWork.Set<Notification>().AnyAsync(n => n.GroupId == groupId && n.ParentNavigate == parentNavigate && n.IdNavigateChild == idNavigateChild);
}
