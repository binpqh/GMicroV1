using AsimKiosk.Contracts.Product.ConfigKiosk.Item;
using AsimKiosk.Contracts.Product.ConfigKiosk.Lang;

namespace AsimKiosk.Contracts.Product.ConfigKiosk;


public class GetProductConfigKioskResult
{
    public string HotLine { get; set; } = string.Empty;
    public string Address { get; set; } = "VPBank Building, 05 Dien Bien Phu Street, Ba Dinh District, Hanoi";
    public string Email { get => Code == "LOCAL_SIM" ? "cskh@asimtelecom.vn" : "contact@vnpass.vn"; }
    public string QrContactUrl
    {
        get => Code == "LOCAL_SIM" ? "https://www.facebook.com/mangdidonglocal" : "https://vnpass.vn";
    }


    public int Index { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string[] ColorCode { get; set; } = [];

    //public string ImgKey { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public ProductKioskLangObj? Lang { get; set; }

    public GetProductConfigKioskResult()
    {

    }

    public static GetProductConfigKioskResult[] InitData(Domain.Entities.Product[] products, string host)
    {
        return products.Select((e, i) =>
        {
            return new GetProductConfigKioskResult
            {
                Index = i,
                Code = e.ProductCode,
                Name = e.ProductName,
                ColorCode = [e.ColorCodePrimary, e.ColorCodeSecondary],
                HotLine = e.Hotline,
                Icon = host + "/Resources/Images/" + e.ProductIcon,
                Lang = ProductKioskLangObj.Init(e, host)
            };
        }).OrderBy(e => e.Index).ToArray();

    }

    public static GetProductConfigKioskResult[] GetMockData()
    {
        return new GetProductConfigKioskResult[] {
            new GetProductConfigKioskResult {
                Index = 0,
                Code = "LOCAL_SIM",
                Name = "Sim Data",
                Icon = "http://103.107.182.5:9601/assets/LOGO_PRO_SIM.png",
                ColorCode = ["#FF2F48", "#FF2F48"],
                HotLine = "1900 1900",
                Lang = ProductKioskLangObj.GetMockSim(),
            },
            new GetProductConfigKioskResult {
                Index = 1,
                Code = "VNPASS",
                Name = "Thẻ Vnpass",
                Icon = "http://103.107.182.5:9601/assets/LOGO_PRO_VNPASS.png",
                ColorCode = ["#419679", "#20596A"],
                HotLine = "0966 081 688",
                Lang = ProductKioskLangObj.GetMockVnpass(),

            }
        };
    }
}

public class ProductKioskLangObj
{
    public ProductLang? Vi { get; set; }
    public ProductLang? En { get; set; }
    public static ProductKioskLangObj Init(Domain.Entities.Product product, string host)
    {
        return new ProductKioskLangObj()
        {
            Vi = new ProductLang()
            {
                Address = "Toà nhà VNBank, 05 Điện Biên Phủ, Quận Ba Đình, Hà Nội",
                ProductTitle = product.VietnameseContent.ProductTitle,
                ImageKey = product.VietnameseContent.PreviewImage,
                Heading = new LangHeading()
                {
                    Title = product.VietnameseContent.Heading?.Heading ?? "",
                    SubTitle = product.VietnameseContent.Heading?.SubHeading ?? "",
                    Description = product.VietnameseContent.Heading?.Description?.ToArray() ?? []
                },
                Items = ProducItemKiosk.Init(
                    product.VietnameseContent.Items.ToArray(),
                    product.EnglishContent.Items.Select(e => e.Price).ToArray(),
                    host,
                    true).ToArray()
            },
            En = new ProductLang()
            {
                Address = "VPBank Building, 05 Dien Bien Phu Street, Ba Dinh District, Hanoi",
                ProductTitle = product.EnglishContent.ProductTitle,
                ImageKey = product.EnglishContent.PreviewImage,
                Heading = product.EnglishContent.Heading != null ? new LangHeading()
                {
                    Title = product.EnglishContent.Heading.Heading ?? "",
                    SubTitle = product.EnglishContent.Heading.SubHeading ?? "",
                    Description = product.EnglishContent.Heading.Description?.ToArray() ?? []
                } : null,
                Items = ProducItemKiosk.Init(
                    product.EnglishContent.Items.ToArray(),
                    product.VietnameseContent.Items.Select(e => e.Price).ToArray(),
                    host,
                    false).ToArray()
            },
        };
    }
    public static ProductKioskLangObj GetMockVnpass()
    {
        return new ProductKioskLangObj()
        {
            Vi = new ProductLang()
            {
                ProductTitle = "CHỌN THẺ VNPASS, TRẢI NGHIỆM ĐẶT VÉ XE TỰ ĐỘNG, DỄ DÀNG",
                ImageKey = "VIEW_PRO_VNPASS_VI.png",
                Heading = null,
                Items = ProducItemKiosk.GetMockItemVnpassVi()
            },
            En = new ProductLang()
            {
                ProductTitle = "MAKE YOUR TRIP MORE CONVENIENT WITH THE ONE - TIME - TRANSPORTATION CARD VNPASS",
                ImageKey = "VIEW_PRO_VNPASS_EN.png",
                Heading = null,
                Items = ProducItemKiosk.GetMockItemVnpassEn()
            }
        };
    }
    public static ProductKioskLangObj GetMockSim()
    {
        return new ProductKioskLangObj()
        {
            Vi = new ProductLang()
            {
                ProductTitle = "CHỌN SIM SIÊU DATA, TRẢI NGHIỆM TỐC ĐỘ CAO VỚI 4G LTE",
                ImageKey = "VIEW_PRO_SIM_VI.png",
                Heading = new LangHeading
                {
                    Title = "MẠNG DI ĐỘNG SIÊU DATA LOCAL",
                    SubTitle = "Sử dụng sóng Mobifone",
                    Description = new string[] {
                        "60GB/30 Ngày",
                        "Gọi điện thoả thích trong 30 phút",
                        "Chỉ với 300.000 VND"
                    }
                },
                Items = ProducItemKiosk.GetMockItemSimVi()
            },
            En = new ProductLang()
            {
                ProductTitle = "ENDLESS EXPERIENCES WITH SUPER HIGH SPEED DATA SIM CARD",
                ImageKey = "VIEW_PRO_SIM_EN.png",
                Heading = new LangHeading
                {
                    Title = "LOCAL SIM 4G",
                    SubTitle = "High speed from MobiFone",
                    Description = new string[] {
                        "60GB/30 Days",
                        "Free call 30 minutes",
                        "Only 300.000 VND"
                    }
                },
                Items = ProducItemKiosk.GetMockItemSimEn()
            }
        };

    }
}