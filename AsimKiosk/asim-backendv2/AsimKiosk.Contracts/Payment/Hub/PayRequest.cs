namespace AsimKiosk.Contracts.Payment.Hub;

public class PayRequest
{
    //Order
    public string OrderCode { get; set; } = null!;
    public long OrderTime { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
    public long TotalAmount { get; set; }

    //Payment Method
    public string PartnerCode { get; set; } = null!;
    public string ProductCode { get; set; } = null!;
    public string? BankCode { get; set; }
    public string ChannelCode { get; set; } = null!;
    public string MerchantCode { get; set; } = null!;
    public string? TerminalCode { get; set; }
    //From Kiosk Application
    public string DeviceId { get; set; } = null!;
    public string CustomerEmail { get; set; } = null!;
    public string CustomerMobile { get; set; } = null!;
    public string CustomerName { get; set; } = null!;

    //Payment Configure
    public string KeySecret { get; set; } = null!;
    public string IpnUrl { get; set; } = null!;
    public string RedirectUrl { get; set; } = null!;
    public string ShopId { get; set; } = string.Empty;
}
