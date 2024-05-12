using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using AsimKiosk.Infrastructure.Persistence.Specifications;
using MongoDB.Bson;
using MongoFramework.Linq;

namespace AsimKiosk.Infrastructure.Persistence.Repositories
{
    internal class UserRepository(IUnitOfWork unitOfWork) : GenericRepository<User>(unitOfWork), IUserRepository
    {
        public async Task<Maybe<EntityCollection<User>>> GetAllUsers() => await UnitOfWork.GetAllAsync<User>();
        public async Task<List<User>> GetUsersByGroupIdAsync(string groupId)
            => await UnitOfWork.Set<User>().Where(u => u.GroupId == groupId 
                && u.Status == ActiveStatus.Active.ToString() 
                && (u.Role == UserRole.User.ToString() || u.Role == UserRole.ManagerGroup.ToString()))
            .ToListAsync();
        public async Task<Maybe<User>> GetByUsernameAsync(string username)
            => Maybe<User>.From(await UnitOfWork.Set<User>().FirstOrDefaultAsync(e => e.Username == username));

        public void Create(User entity) => UnitOfWork.Set<User>().Add(entity);
        public async Task<bool> IsEmailUniqueAsync(string email)
            => !await AnyAsync(new UserWithEmailSpecification(email));

        public async Task<List<User>> GetUsersByIds(List<ObjectId> userIds)  
            => await UnitOfWork.Set<User>().Where(u => userIds.Contains(u.Id)).ToListAsync();
        public void UpdateUserById(User entity)  => UnitOfWork.Set<User>().Update(entity);

        public async Task InsertUsersToGroupAsync(string groupId, List<string> userIds)
        {
            var ids = ParseToObjectId(userIds);
            (await UnitOfWork.Set<User>().Where(u => ids.Contains(u.Id)).ToListAsync()).ForEach(user => user.GroupId = groupId);
        }
        public async Task RemoveUsersFromGroupAsync(string groupId, List<string> userIds)
        {
            var ids = ParseToObjectId(userIds);
            (await UnitOfWork.Set<User>().Where(u => ids.Contains(u.Id)).ToListAsync()).ForEach(u => u.GroupId = string.Empty);
        }

        public async Task<List<User>> GetUserNoGroupAsync()
            => await UnitOfWork.Set<User>().Where(u => (u.GroupId == string.Empty || u.GroupId == null) 
                            && u.Status == ActiveStatus.Active.ToString() 
                            && u.Role == UserRole.User.ToString())
                        .ToListAsync();

        private List<ObjectId> ParseToObjectId(List<string> userIds)
        {
            List<ObjectId> ids = new();
            userIds.ForEach(ui => ids.Add(ObjectId.Parse(ui)));
            return ids;
        }

        public async Task<bool> IsUsernameUniqueAsync(string userName)
            => !await UnitOfWork.Set<User>().AnyAsync(u => u.Username == userName);
    }
}