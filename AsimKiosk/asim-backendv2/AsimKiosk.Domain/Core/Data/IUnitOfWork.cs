using AsimKiosk.Domain.Core.Primitives;
using MongoDB.Driver;
using MongoFramework;

namespace AsimKiosk.Domain.Core.Data;

public interface IUnitOfWork : IMongoDbContext, IDisposable
{
    Task<IClientSessionHandle> BeginTransactionAsync();
    Task<Maybe<EntityCollection<TEntity>>> GetAllAsync<TEntity>()
        where TEntity : Entity;
    Task<Maybe<TEntity>> GetBydIdAsync<TEntity>(string id)
        where TEntity : Entity;
    void Insert<TEntity>(TEntity entity)
        where TEntity : Entity;
    void InsertRange<TEntity>(IReadOnlyCollection<TEntity> entities)
        where TEntity : Entity;
    Task RemoveAsync<TEntity>(TEntity entity)
        where TEntity : Entity;
}