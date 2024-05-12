namespace AsimKiosk.Domain.Core.Primitives;

public class EntityCollection<TEntity>(ICollection<TEntity> entities)
    where TEntity : Entity
{

    public ICollection<TEntity> Entities = entities;
}