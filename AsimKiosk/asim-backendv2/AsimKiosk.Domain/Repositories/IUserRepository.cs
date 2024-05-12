using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using MongoDB.Bson;
using System.Collections.Generic;

namespace AsimKiosk.Domain.Repositories
{
    public interface IUserRepository
    {
        /// <summary>
        /// Gets all the users in the database.
        /// </summary>
        /// <returns>A list of all users in the current database.</returns>
        Task<Maybe<EntityCollection<User>>> GetAllAsync();
        /// <summary>
        ///  Gets the user with the specified identifier.
        /// </summary>
        /// <param name="userId">The user Identifier.</param>
        /// <returns>The maybe instance that may contain the user with the specified identifier.</returns>
        Task<Maybe<User>> GetByIdAsync(string userId);
        /// <summary>
        /// Gets get users by ids
        /// </summary>
        /// <param name="userIds"></param>
        /// <returns>A list of users with the corresponding ids</returns>
        Task<List<User>> GetUsersByIds(List<ObjectId> userIds);
        /// <summary>
        /// Gets list users with the group's specified identifier.
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns>List users with the group's specified identifier.</returns>
        Task<List<User>> GetUsersByGroupIdAsync(string groupId);
        /// <summary>
        /// Gets the user by their username.
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        Task<Maybe<User>> GetByUsernameAsync(string username);
        /// <summary>
        /// Checks if the specified email is unique.
        /// </summary>
        /// <param name="email">The email.</param>
        /// <returns>True if the specified email is unique, otherwise false.</returns>
        Task<bool> IsEmailUniqueAsync(string email);
        Task<bool> IsUsernameUniqueAsync(string userName);
        Task<List<User>> GetUserNoGroupAsync();
        Task InsertUsersToGroupAsync(string groupId, List<string> userIds);
        Task RemoveUsersFromGroupAsync(string groupId, List<string> userIds);
        void Insert(User user);
        void Create(User entity);
        void UpdateRange(IReadOnlyCollection<User> users);
        Task RemoveAsync(User user);
    }
}