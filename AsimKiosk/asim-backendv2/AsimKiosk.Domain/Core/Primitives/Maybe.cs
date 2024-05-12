namespace AsimKiosk.Domain.Core.Primitives
{
    public class Maybe<T>
    {
        private readonly T _value;

        /// <summary>
        /// Initializes a new instance of the <see cref="Maybe{T}"/> class.
        /// </summary>
        /// <param name="value">The value.</param>
        private Maybe(T value) => _value = value;

        /// <summary>
        /// Gets a value indicating whether the value exists.
        /// </summary>
        public bool HasValue => !HasNoValue;

        /// <summary>
        /// Gets a value indicating whether the value does not exist.
        /// </summary>
        public bool HasNoValue => _value is null;

        /// <summary>
        /// Gets the value.
        /// </summary>
        public T Value => _value;

        /// <summary>
        /// Gets the default empty instance.
        /// </summary>
        public static Maybe<T> None => new Maybe<T>(default!);

        /// <summary>
        /// Creates a new <see cref="Maybe{T}"/> instance based on the specified value.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns>The new <see cref="Maybe{T}"/> instance.</returns>
        public static Maybe<T> From(T value) => new Maybe<T>(value);

        public static implicit operator Maybe<T>(T value) => From(value);

        public static implicit operator T(Maybe<T> maybe) => maybe.Value;
   
    }
}
