using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Infrastructure.Persistence.Specifications;
using MongoFramework.Linq;

namespace AsimKiosk.Infrastructure.Persistence.Repositories
{
    internal abstract class GenericRepository<TEntity>
         where TEntity : Entity
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="GenericRepository{TEntity}"/> class.
        /// </summary>
        /// <param name="unitOfWork">The database context.</param>
        protected GenericRepository(IUnitOfWork unitOfWork) => UnitOfWork = unitOfWork;

        /// <summary>
        /// Gets the database context.
        /// </summary>
        protected IUnitOfWork UnitOfWork { get; }

        /// <summary>
        /// Gets the entity with the specified identifier.
        /// </summary>
        /// <param name="id">The entity identifier.</param>
        /// <returns>The maybe instance that may contain the entity with the specified identifier.</returns>
        public async Task<Maybe<TEntity>> GetByIdAsync(string id) => await UnitOfWork.GetBydIdAsync<TEntity>(id);
        /// <summary>
        /// Gets all entities within a database collection
        /// </summary>
        /// <returns></returns>
        public async Task<Maybe<EntityCollection<TEntity>>> GetAllAsync() => await UnitOfWork.GetAllAsync<TEntity>();
        /// <summary>
        /// Inserts the specified entity into the database.
        /// </summary>
        /// <param name="entity">The entity to be inserted into the database.</param>
        public void Insert(TEntity entity) => UnitOfWork.Insert(entity);

        /// <summary>
        /// Inserts the specified entities to the database.
        /// </summary>
        /// <param name="entities">The entities to be inserted into the database.</param>
        public void InsertRange(IReadOnlyCollection<TEntity> entities) => UnitOfWork.InsertRange(entities);

        /// <summary>
        /// Updates the specified entity in the database.
        /// </summary>
        /// <param name="entity">The entity to be updated.</param>
        //public void Update(TEntity entity) => UnitOfWork.Set<TEntity>().Update(entity);
        
        /// <summary>
        /// Updates the specified entities in the database.
        /// </summary>
        /// <param name="entities"></param>
        public void UpdateRange(IReadOnlyCollection<TEntity> entities) => UnitOfWork.Set<TEntity>().UpdateRange(entities);

        /// <summary>
        /// Removes the specified entity from the database.
        /// </summary>
        /// <param name="entity">The entity to be removed from the database.</param>
        public Task RemoveAsync(TEntity entity) => UnitOfWork.RemoveAsync(entity);
        /// <summary>
        /// Checks if any entity meets the specified specification.
        /// </summary>
        /// <param name="specification">The specification.</param>
        /// <returns>True if any entity meets the specified specification, otherwise false.</returns>
        protected async Task<bool> AnyAsync(Specification<TEntity> specification) =>
            await UnitOfWork.Set<TEntity>().AnyAsync(specification);

        /// <summary>
        /// Gets the first entity that meets the specified specification.
        /// </summary>
        /// <param name="specification">The specification.</param>
        /// <returns>The maybe instance that may contain the first entity that meets the specified specification.</returns>
        protected async Task<Maybe<TEntity>> FirstOrDefaultAsync(Specification<TEntity> specification) =>
            await UnitOfWork.Set<TEntity>().FirstOrDefaultAsync(specification);
    }
}