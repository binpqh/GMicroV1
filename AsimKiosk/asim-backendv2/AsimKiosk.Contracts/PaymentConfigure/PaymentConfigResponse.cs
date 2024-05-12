

using AsimKiosk.Domain.ValueObject;

namespace AsimKiosk.Contracts.PaymentConfigure;

public class PaymentConfigResponse
{
    public string Id { get; set; } = string.Empty;
    public string KeySecret { get; set; } = string.Empty;
    public string ChannelCode { get; set; } = string.Empty;
    public string MerchantCode { get; set; } = string.Empty;
    public UrlDomain UrlDomain { get; set; } = new UrlDomain();
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerMobile { get; set; } = string.Empty;
    public string IpnUrl { get; set; } = string.Empty;
    public string RedirectUrl { get; set; } = string.Empty;
    public string ShopId { get; set; } = string.Empty;
    public string Status { get ; set; } = string.Empty;
  
}
