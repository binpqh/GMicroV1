using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Events;

namespace AsimKiosk.Domain.ValueObject;

public class PaymentConfig : AggregateRoot
{
    public PaymentConfig(string merchantCode, UrlDomain domain, string channelCode,
     string keySecret, string customerEmail, string customerMobile, string customerName,
     string ipnUrl, string redirectUrl,string shopId)
    {
        MerchantCode = merchantCode;
        ChannelCode = channelCode;
        KeySecret = keySecret;
        UrlDomain = domain;
        CustomerEmail = customerEmail;
        CustomerMobile = customerMobile;
        CustomerName = customerName;
        IpnUrl = ipnUrl;
        RedirectUrl = redirectUrl;
        ShopId = shopId;
    }

   
    public string Status { get; set; } = ActiveStatus.Inactive.ToString();
    public string KeySecret { get; set; } = "4bFksLAXP1kGqbJBBJU6CdcmcuI84kxL";
    public string ChannelCode { get; set; } = "KIOSK";
    public string MerchantCode { get; set; } = "PMS1676864853990";
    public UrlDomain UrlDomain { get; set; }
    public string CustomerEmail { get; set; }
    public string CustomerName { get; set; }
    public string CustomerMobile { get; set; }
    public string ShopId { get; set; } = string.Empty;
    public string IpnUrl { get; set; }
    public string RedirectUrl { get; set; }
    public DateTime ModifiedOn { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public PaymentConfig Create(PaymentConfig paymentConfig,string createBy)
    {
        paymentConfig.AddDomainEvent(new PaymentConfigCreatedDomainEvent(paymentConfig,createBy));
        return paymentConfig;
    }
    public void Update(PaymentConfig paymentConfig, string createBy)
    {
        paymentConfig.AddDomainEvent(new PaymentConfigCreatedDomainEvent(paymentConfig, createBy));
    }
}
public class UrlDomain
{
    public string PaymentConfig { get; set; } = string.Empty;
    public string PaymentGateway { get; set; } = string.Empty;
}
