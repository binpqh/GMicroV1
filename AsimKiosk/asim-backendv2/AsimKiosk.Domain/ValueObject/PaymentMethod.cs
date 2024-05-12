namespace AsimKiosk.Domain.ValueObject;

public class PaymentMethod
{
    public string PartnerCode { get; set; } = string.Empty;
    public string PartnerName { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public ICollection<PaymentProduct> PaymentProducts { get; set; } = new List<PaymentProduct>();
    public class PaymentProduct
    {
        public string ProductCode { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public ICollection<PaymentBankCode> PaymentBankCodes { get; set; } = new List<PaymentBankCode>();
        public class PaymentBankCode
        {
            public string BankCode { get; set; } = string.Empty;
            public string BankName { get; set; } = string.Empty;
            public string Icon { get; set; } = string.Empty; // Link url image icon
        }
    }
}