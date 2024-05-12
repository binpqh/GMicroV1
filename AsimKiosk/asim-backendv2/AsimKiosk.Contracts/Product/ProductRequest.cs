using Microsoft.AspNetCore.Http;

namespace AsimKiosk.Contracts.Product;
public class UpdateProductOnlyRequest
{
    //Product general
    public string ProductName { get; set; } = string.Empty;
    public required IFormFile ProductIcon { get; set; }
    public string ColorCodePrimary { get; set; } = string.Empty;
    public string? ColorCodeSecondary { get; set; } = string.Empty;
    public string Hotline { get; set; } = string.Empty;
    public bool IsRequireSerialNumber { get; set; } = false;
    public UpdateProductWithoutItemsRequest EnglishContent { get; set; } = new();
    public UpdateProductWithoutItemsRequest VietnameseContent { get; set; } = new();
}
public class ProductRequest
{
    //Product general
    public string ProductName { get; set; } = string.Empty;
    public string ProductCode { get; set; } = string.Empty;
    public required IFormFile ProductIcon { get; set; }
    public string ColorCodePrimary { get; set; } = string.Empty;
    public string? ColorCodeSecondary { get; set; } = string.Empty;
    public string Hotline { get; set; } = string.Empty;
    public bool IsRequireSerialNumber { get; set; } = false;
    public ProductEnglishRequest EnglishContent { get; set; } = new();
    public ProductVietnameseRequest VietnameseContent { get; set; } = new();
}
public class UpdateItemRequest
{
    public string Id { get; set; } = string.Empty;
    public string? CodeItem { get; set; }
    public string? CodeTitle { get; set; }
    public IFormFile? Icon { get; set; }
    public double Price { get; set; }
    public List<string> Description { get; set; } = new();
    public string? Note { get; set; }
}
public class ItemProductRequest
{
    public string CodeItem { get; set; } = string.Empty;
    public string CodeTitle { get; set; } = string.Empty;
    public IFormFile Icon { get; set; } = null!;
    public double Price { get; set; }
    public List<string> Description { get; set; } = new();
    public string Note { get; set; } = string.Empty;
}
public class ProductVietnameseRequest
{
    public IFormFile ProductPreviewImage { get; set; } = null!;
    //Product heading-content
    public string? Title { get; set; } = string.Empty;
    public string? Heading { get; set; }
    public string? SubHeading { get; set; }
    public List<string>? Description { get; set; }
    //Product items
    public List<ItemProductRequest> Items { get; set; } = new();
}
public class ProductEnglishRequest
{
    public IFormFile ProductPreviewImage { get; set; } = null!;
    //Product heading-content
    public string? Title { get; set; } = string.Empty;
    public string? Heading { get; set; }
    public string? SubHeading { get; set; }
    public List<string>? Description { get; set; }
    //Product items
    public List<ItemProductRequest> Items { get; set; } = new();
}

public class AddItemsRequest
{
    public List<ItemProductRequest> VietnameseItems { get; set; } = new();
    public List<ItemProductRequest> EnglishItems { get; set; } = new();
}
public class UpdateItemsRequest
{
    public List<UpdateItemRequest>? VietnameseItems { get; set; }
    public List<UpdateItemRequest>? EnglishItems { get; set; }
}

public class UpdateProductWithoutItemsRequest
{
    public IFormFile ProductPreviewImage { get; set; } = null!;
    //Product heading-content
    public string? Title { get; set; } = string.Empty;
    public string? Heading { get; set; }
    public string? SubHeading { get; set; }
    public List<string>? Description { get; set; }
    //Product items
}