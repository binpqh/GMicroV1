using AsimKiosk.Domain.ValueObject;

namespace AsimKiosk.Contracts.PaymentConfigure;

public class UpdatePaymentConfigRequest
{
    public string Id { get; set; } = string.Empty;
    public string? KeySecret { get; set; } = string.Empty;
    public string? MerchantCode { get; set; } = string.Empty;
    public string? ChannelCode { get; set; } = string.Empty;
    public string? TerminalCode { get; set; } = string.Empty;
    public UrlDomain DomainUrl { get; set; } = new();
    public string? CustomerEmail { get; set; } = string.Empty;
    public string? CustomerName { get; set; } = string.Empty;
    public string? CustomerMobile { get; set; } = string.Empty;
    public string? IpnUrl { get; set; } = string.Empty;
    public string? RedirectUrl { get; set; } = string.Empty;
    public string? ShopId { get; set; } = string.Empty;
}
