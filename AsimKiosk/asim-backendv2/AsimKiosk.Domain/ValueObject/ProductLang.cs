namespace AsimKiosk.Domain.ValueObject;

public class ProductVietnameseContent
{
    public string ProductTitle { get; set; } = string.Empty;
    public ProductHeading? Heading { get; set; }
    public List<Item> Items { get; set; } = [];
    public string PreviewImage { get; set; } = string.Empty;
}
public class ProductEnglishContent
{
    public string ProductTitle { get; set; } = string.Empty;
    public ProductHeading? Heading { get; set; }
    public List<Item> Items { get; set; } = [];
    public string PreviewImage { get; set; } = string.Empty;

}
