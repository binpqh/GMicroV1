using MongoFramework;
using MediatR;
using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Core.Events;
using MongoFramework.Infrastructure;
using AsimKiosk.Domain.Core.Abstractions;
using AsimKiosk.Domain.Enums;
using MongoFramework.Linq;
using System.Data;
using MongoDB.Driver;
using MongoDB.Bson;

namespace AsimKiosk.Infrastructure.Persistence;

public class AsimDbContext(IMongoDbConnection connection, IMediator mediator) : MongoDbContext(connection), IUnitOfWork
{
    private readonly IMongoClient _mongoClient = connection.Client;

    public async Task<Maybe<TEntity>> GetBydIdAsync<TEntity>(string id)
        where TEntity : Entity => string.IsNullOrWhiteSpace(id) ?
                Maybe<TEntity>.None :
                Maybe<TEntity>.From(await Set<TEntity>().FirstOrDefaultAsync(e => e.Id == ObjectId.Parse(id)));

    public async Task<Maybe<EntityCollection<TEntity>>> GetAllAsync<TEntity>()
        where TEntity : Entity
    {
        var res = Maybe<EntityCollection<TEntity>>.From(new EntityCollection<TEntity>(await Set<TEntity>().ToListAsync()));
        return res;
    }

    public void Insert<TEntity>(TEntity entity)
        where TEntity : Entity
        => Set<TEntity>().Add(entity);

    public void InsertRange<TEntity>(IReadOnlyCollection<TEntity> entities)
        where TEntity : Entity
        => Set<TEntity>().AddRange(entities);

    public async Task RemoveAsync<TEntity>(TEntity entityId)
       where TEntity : Entity
    {
        var entry = await Set<TEntity>().FirstOrDefaultAsync(e => e.Id == entityId.Id);
        if(entry is ISoftDeletableEntity)
        {
            entry.GetType()!.GetProperty("Status")!.SetValue(entry, "Deleted", null);
        }
        else
        {
            Set<TEntity>().Remove(entry);
        }
    }

    public async Task<IClientSessionHandle> BeginTransactionAsync()
    {
        var session = await _mongoClient.StartSessionAsync();
        session.StartTransaction();
        return session;
    }

    public override async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        ProcessEntitiesBeforeSaveChanges();

        await base.SaveChangesAsync(cancellationToken);

        await PublishDomainEvents(cancellationToken);
    }
    private void ProcessEntitiesBeforeSaveChanges()
    {
        var entries = ChangeTracker?
            .Entries();
        List<EntityEntry>? auditableEntries;
        try
        {
            auditableEntries = entries is not null ? entries.Where(entry => entry.Entity is IAuditableEntity).ToList() : new();
        }
        catch
        {
            auditableEntries = new();
        }
        foreach (var entry in auditableEntries)
        {
            if (entry.State == EntityEntryState.Added)
            {
                var createdOnUtcProperty = entry.Entity.GetType().GetProperty("CreatedAt");
                if (createdOnUtcProperty != null)
                {
                    createdOnUtcProperty.SetValue(entry.Entity, DateTime.UtcNow, null);
                }
            }
            else if (entry.State == EntityEntryState.Updated)
            {
                var statusProperty = entry.Entity.GetType().GetProperty("Status");
                if(statusProperty is not null && statusProperty.CanRead)
                {
                    var statusValue = statusProperty.GetValue(entry.Entity);
                    if(statusValue is not null && statusValue.ToString() == ActiveStatus.Deleted.ToString())
                    {
                        var deleteOnUtcProperty = entry.Entity.GetType().GetProperty("DeletedOn");
                        
                        if (deleteOnUtcProperty != null)
                        {
                            statusProperty.SetValue(entry.Entity, "Deleted", null);
                            deleteOnUtcProperty.SetValue(entry.Entity, DateTime.UtcNow, null);
                        }
                    }
                    else
                    {
                        var modifiedOnUtcProperty = entry.Entity.GetType().GetProperty("ModifiedOn");
                        if (modifiedOnUtcProperty != null)
                        {
                            statusProperty.SetValue(entry.Entity, "Inactive", null);
                            modifiedOnUtcProperty.SetValue(entry.Entity, DateTime.UtcNow, null);
                        }
                    }
                }
            }

        }
    }
    /// <summary>
    /// Check that entry has any reference
    /// </summary>
    /// <param name="entity">EntityEntry</param>
    /// <param name="entityId">ID of Entry going to check ref</param>
    /// <returns></returns>
    private static bool HasReferenceToDeletedEntry(object entity, string entityId)
    {
        var entityType = entity.GetType();

        var properties = entityType.GetProperties();

        foreach (var property in properties)
        {
            if (property.Name.EndsWith("Id"))
            {
                var propertyValue = property.GetValue(entity);

                if (propertyValue != null && propertyValue.ToString() == entityId)
                {
                    return true;
                }
            }
        }
        return false;
    }
    private async Task PublishDomainEvents(CancellationToken cancellationToken)
    {
        List<EntityEntry>? aggregateRoots;
        var entries = ChangeTracker?
            .Entries();
        try
        {
            aggregateRoots = entries is not null ? entries.Where(entry => entry.Entity is AggregateRoot).ToList() : new();

        }
        catch
        {
            aggregateRoots = new();
        }
        List<IDomainEvent> domainEvents = new List<IDomainEvent>();

        foreach (var entry in aggregateRoots)
        {
            var aggregateRoot = entry.Entity as AggregateRoot;
            if (aggregateRoot is not null && aggregateRoot.DomainEvents is not null && aggregateRoot.DomainEvents.Any())
            {
                domainEvents.AddRange(aggregateRoot.DomainEvents);
                aggregateRoot.ClearDomainEvents();
            }
        }
        if (domainEvents.Count > 0)
        {
            IEnumerable<Task> tasks = domainEvents.Select(domainEvent => mediator.Publish(domainEvent, cancellationToken));

            await Task.WhenAll(tasks);
        }
    }
}
