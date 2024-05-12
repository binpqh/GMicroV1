using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Repositories;
using AsimKiosk.Infrastructure.Persistence.Specifications;
using MongoDB.Bson;
using MongoFramework.Linq;

namespace AsimKiosk.Infrastructure.Persistence.Repositories;

internal class GroupRepository(IUnitOfWork unitOfWork) : GenericRepository<Domain.Entities.Group>(unitOfWork), IGroupRepository
{
    public string GetGroupNameById(string? groupId)
    {
        if (groupId is null) return "No Group";
        return UnitOfWork.Set<Domain.Entities.Group>().Where(g => g.Id == ObjectId.Parse(groupId)).Select(g => g.GroupName).FirstOrDefault() ?? string.Empty;
    }

    public async Task<bool> IsGroupNameUniqueAsync(string groupName)
    {
        return !await AnyAsync(new GroupNameSpecification(groupName));
    }

    public async Task<bool> IsKioskInGroup(string deviceId, string groupId)
    {
        var kiosk = await UnitOfWork.Set<Domain.Entities.Kiosk>().FirstOrDefaultAsync(k=>k.DeviceId == deviceId);
        if (kiosk != null && kiosk.GroupId == groupId)
        {
            return true;
        }
        return false;
    }

    public async Task<bool> IsUserInGroup(string userId, string groupId)
    {
        var user = await UnitOfWork.Set<Domain.Entities.User>().FirstOrDefaultAsync(k => k.Id == ObjectId.Parse(userId));
        if (user != null && user.GroupId == groupId)
        {
            return true;
        }
        return false;
    }
}