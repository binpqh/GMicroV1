using System.Text.Json.Serialization;
using AsimKiosk.Contracts.Product.ConfigKiosk.Item;

namespace AsimKiosk.Contracts.Product.ConfigKiosk.Lang;

public class ProductLang
{
    [JsonPropertyName("product_title")]
    public string ProductTitle { get; set; } = string.Empty;

    public string ImageKey { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public LangHeading? Heading { get; set; }

    public ProducItemKiosk[]? Items { get; set; }
}

public class LangHeading
{
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("sub_title")]
    public string SubTitle { get; set; } = string.Empty;

    public string[]? Description { get; set; }
}

