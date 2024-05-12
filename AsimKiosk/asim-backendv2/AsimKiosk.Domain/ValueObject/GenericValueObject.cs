
namespace AsimKiosk.Domain.ValueObject;

public abstract class GenericValueObject
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
}
