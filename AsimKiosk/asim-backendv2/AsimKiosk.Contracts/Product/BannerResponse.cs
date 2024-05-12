

namespace AsimKiosk.Contracts.Product;

public class BannerResponse
{
    public string ImageKey { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int Priority { get; set; }
}
