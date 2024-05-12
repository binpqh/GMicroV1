using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Domain.Core.Primitives
{
    public sealed class Error(string code, string message) : ValueObject
    {
        public Error(string code, string message, ErrorType errorType) : this(code,message)
        {
            Code = code;
            Message = message;
            Type = errorType;
        }

        public string Code { get; } = code;

        public string Message { get; } = message;
        public ErrorType Type { get; set; } = ErrorType.Business;

        public static implicit operator string(Error error) => error?.Code ?? string.Empty;

        internal static Error None => new(string.Empty, string.Empty);
        protected override IEnumerable<object> GetAtomicValues()
        {
            yield return Code;
            yield return Message;
        }
    }
}
