using AsimKiosk.Contracts.Product.ConfigKiosk;

namespace AsimKiosk.Contracts.Kiosk.Config;

public class KioskConfigResult
{
    public KioskPaymentMethod[]? PaymentTypeAvailables { get; set; }
    public SysConfig Config { get; set; } = new();
    public string[] Banners { get; set; } = [];
    public string? Header { get; set; }
    public string? Icon { get; set; }
    public GetProductConfigKioskResult[]? Products { get; set; }
    public Peripheral[]? ExtDevices { get; set; }

    // public PrintConfig[] PrintConfig { get; set; } = [new PrintConfig("LOCAL_SIM", "cskh@asimtelecom.vn", "1900 1900"), new PrintConfig("VNPASS", "contact@vnpass.vn", "0966 081 688")];
    public ActiveSim ActiveSimInfo { get; set; } = new ActiveSim("https://apps.apple.com/vn/app/mylocal-vn/id1543101669?l=vi", "http://103.107.182.5:9601/Resources/Videos/rk30sdk_1707121083940.mp4");
}

public record ActiveSim(string BarCodeUrl, string VideoUrl);
public class SysConfig
{
    public int TimeoutBanner { get; set; } = 5000;
    public int TimeoutDispenser { get; set; } = 5000;
    public int TimeoutPayment { get; set; } = 60 * 1000 * 10;
}

public class Peripheral
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Path { get; set; }
    public string? ItemCode { get; set; }
}

// copied from AsimKiosk.Contracts.Kiosk.KioskConfig
public class KioskPaymentMethod
{
    public string ProductCode { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public BankCode[] BankCodes { get; set; } = [];

    public class BankCode
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
    }
}