namespace AsimKiosk.Domain.Core.Primitives
{
    public abstract class ValueObject : IEquatable<ValueObject>
    {
        public static bool operator ==(ValueObject a, ValueObject b)
        {
            if (a is null && b is null)
            {
                return true;
            }

            if (a is null || b is null)
            {
                return false;
            }

            return a.Equals(b);
        }

        public static bool operator !=(ValueObject a, ValueObject b) => !(a == b);

        public override int GetHashCode()
        {
            HashCode hashCode = default;

            foreach (object obj in GetAtomicValues())
            {
                hashCode.Add(obj);
            }

            return hashCode.ToHashCode();
        }
        protected abstract IEnumerable<object> GetAtomicValues();

        public bool Equals(ValueObject? other) => !(other is null) && GetAtomicValues().SequenceEqual(other.GetAtomicValues());

        public override bool Equals(object? obj)
        {
            if (obj == null)
            {
                return false;
            }

            if (GetType() != obj.GetType())
            {
                return false;
            }

            if (!(obj is ValueObject valueObject))
            {
                return false;
            }

            return GetAtomicValues().SequenceEqual(valueObject.GetAtomicValues());
        }
    }
}
