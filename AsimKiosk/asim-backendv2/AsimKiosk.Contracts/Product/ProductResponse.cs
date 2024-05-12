using AsimKiosk.Domain.ValueObject;

namespace AsimKiosk.Contracts.Product;
public class ProductResponse
{
    public string Id { get; set; } = null!;
    public string ProductName { get; set; } = null!;
    public string ProductCode { get; set; } = null!;
    public string ProductIcon { get; set; } = string.Empty;
}
public class ProductDetailResponse
{
    public string Id { get; set; } = null!;
    public string ProductName { get; set; } = null!;
    public string ProductCode { get; set; } = string.Empty;
    public string ProductIcon { get; set; } = string.Empty;
    public string ColorCodePrimary { get; set; } = string.Empty;
    public string ColorCodeSecondary { get; set; } = string.Empty;
    public string Hotline { get; set; } = string.Empty;
    public bool IsRequireSerialNumber { get; set; } = false;
    public ProductEnglishContent EnglishContent { get; set; } = new();
    public ProductVietnameseContent VietnameseContent { get; set; } = new();
    public string Status { get; set; } = string.Empty;
}
public class ProductItemResponse
{
    public string CodeTitle { get; set; } = string.Empty;
    public string CodeItem { get; set; } = string.Empty;
    public string IconItem { get; set; } = string.Empty;
    public double Price { get; set; }
    public List<string> Description { get; set; } = new();
}

public class ProductDropdownResponse
{
    public string ProductCode { get; set; } = string.Empty;
    public List<string> ItemCodes { get; set; } = [];
}