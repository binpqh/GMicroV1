namespace AsimKiosk.Contracts.Payment;

/// <summary>
/// OrderCode is a prop has been generated from kiosk applicaion.
/// ProductCode is a prop required for request pay - Payment Hub Asim.
/// BankCode is a child's ProductCode
/// </summary>
public class PaymentRequest
{
    public string OrderCode { get; set; } = string.Empty;
    public string ProductCode { get; set; } = string.Empty;
    public string? BankCode { get; set; }
}
public class RequestPaymentResponse
{
    public string PayUrl { get; set; } = null!;
    public string TransNo { get; set; } = null!;
    public long TotalAmount { get; set; }
}