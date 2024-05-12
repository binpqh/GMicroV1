using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Repositories
{
    public interface IGroupRepository
    {
        /// <summary>
        /// Gets the group with the specified identifier.
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns>The maybe instance that may contain the group with the specified identifier.</returns>
        Task<Maybe<Group>> GetByIdAsync(string groupId);
        Task<Maybe<EntityCollection<Group>>> GetAllAsync();
        Task<bool> IsKioskInGroup(string deviceId, string groupId);
        Task<bool> IsUserInGroup(string userId, string groupId);
        string GetGroupNameById(string? groupId);
        void Insert(Group group);
        Task RemoveAsync(Group group);
        Task<bool> IsGroupNameUniqueAsync(string groupName);
    }
}