using AsimKiosk.Domain.Core.Utility;
using MongoDB.Bson;

namespace AsimKiosk.Domain.Core.Primitives
{
    public abstract class Entity
    {
        protected Entity(ObjectId id)
            : this()
        {
            Id = id;
        }
        protected Entity()
        {
        }
        public ObjectId Id { get; set; }
    }
}
