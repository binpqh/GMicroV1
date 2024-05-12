namespace AsimKiosk.Contracts.Payment.Hub;

public class IpnRequest
{
    public string? OrderNo { get; set; }
    public string? TransNo { get; set; }
    public int PaymentStatus { get; set; }
    public string? TokenInfo { get; set; }
}

