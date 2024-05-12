namespace AsimKiosk.Contracts.Payment.Hub;

public class PaymentHubListReponse
{
    public string PartnerBankCode { get; set; } = string.Empty;
    public string PartnerBankName { get; set; } = string.Empty;
    public string PartnerBankIcon { get; set; } = string.Empty; // Link url image icon
}
public class RequestPayResponse
{
    public string OrderNo { get; set; } = string.Empty;
    public string OrderId { get; set; } = string.Empty;
    public string TransNo { get; set; } = string.Empty;
    public long TotalAmount { get; set; }
    public string PayUrl { get; set; } = string.Empty;
    public string WebviewUrl { get; set; } = string.Empty;
    public string QrCodeUrl { get; set; } = string.Empty;
    public string Signature { get; set; } = string.Empty;
    public string RequestId { get;set; } = string.Empty;
    public string ClientIp { get; set; } = string.Empty;
}

