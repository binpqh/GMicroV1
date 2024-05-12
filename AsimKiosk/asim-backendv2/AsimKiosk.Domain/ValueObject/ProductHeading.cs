namespace AsimKiosk.Domain.ValueObject;

public class ProductHeading : GenericValueObject
{
    public string? Heading { get; set; }
    public string? SubHeading { get; set; }
    public List<string>? Description { get; set; }
}
