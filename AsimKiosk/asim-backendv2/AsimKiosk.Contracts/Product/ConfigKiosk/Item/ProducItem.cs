namespace AsimKiosk.Contracts.Product.ConfigKiosk.Item;
public class ProducItemKiosk
{
    public string Title { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Note { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public ProducItemKioskContent? Description { get; set; }
    public ProducItemKioskPrice Price { get; set; } = new();

    public static IEnumerable<ProducItemKiosk> Init(
        AsimKiosk.Domain.ValueObject.Item[] items,
        double[] itemsForPrice,
        string host,
        bool isVn = false)
    {
        var index = -1;
        foreach (var e in items)
        {
            index++;
            yield return new ProducItemKiosk
            {
                Title = e.CodeTitle,
                Code = e.CodeItem,
                Note = e.Note ?? "",
                Icon = host + "/Resources/Images/" + e.IconItem, //"http://103.107.182.5:9601/assets/ITEM_86_EN.png",
                Description = new()
                {
                    Title = isVn == false ? "Description" : "Mô tả",
                    Content = e.Description.ToArray()
                },
                Price = new()
                {
                    Vnd = isVn == true ? e.Price : itemsForPrice[index],
                    Usd = isVn == true ? itemsForPrice[index] : e.Price
                }

            };
        }
    }
    public static ProducItemKiosk[] GetMockItemVnpassEn()
    {
        return new ProducItemKiosk[] {
            new ProducItemKiosk {
                Title = "Bus number",
                Code = "86",
                Note = null,
                Icon = "http://103.107.182.5:9601/assets/ITEM_86_EN.png",
                Description = new() {
                    Title = "Description",
                    Content = [
                        "Ticket can be used for the bus 86 from Noi Bai Airport to Hanoi Center",
                        "One-time Use"]
                },
                Price = new() {
                    Vnd = 45000,
                    Usd = 1.85
                }
            },
            new ProducItemKiosk {
                Title = "Bus number",
                Code = "68",
                Note = null,
                Icon = "http://103.107.182.5:9601/assets/ITEM_68_EN.png",
                Description = new() {
                    Title = "Description",
                    Content = [
                        "Ticket can be used for the bus 68 from Noi Bai Airport to Ha Dong - Ha Noi",
                        "One-time Use"]
                },
                Price = new() {
                    Vnd = 45000,
                    Usd = 1.85
                }
            }
        };
    }
    public static ProducItemKiosk[] GetMockItemVnpassVi()
    {
        return new ProducItemKiosk[] {
            new ProducItemKiosk {
                Title = "Tuyến số",
                Code = "86",
                Note = null,
                Icon = "http://103.107.182.5:9601/assets/ITEM_86_VI.png",
                Description = new() {
                    Title = "Mô tả",
                    Content = [
                        "Vé được sử dụng cho xe buýt tuyến 86 đi từ sân bay Nội Bài đến trung tâm Hà Nội",
                        "Vé dùng 1 lần"]
                },
                Price = new() {
                    Vnd = 45000,
                    Usd = 1.85
                }
            },
            new ProducItemKiosk {
                Title = "Tuyến số",
                Code = "68",
                Note = null,
                Icon = "http://103.107.182.5:9601/assets/ITEM_68_VI.png",
                Description = new() {
                    Title = "Mô tả",
                    Content = [
                        "Vé được sử dụng cho xe buýt tuyến 86 đi từ sân bay Nội Bài đến trung tâm Hà Đông - Hà Nội",
                        "Vé dùng 1 lần"]
                },
                Price = new() {
                    Vnd = 45000,
                    Usd = 1.85
                }
            }
        };
    }
    public static ProducItemKiosk[] GetMockItemSimVi()
    {
        return new ProducItemKiosk[] {
            new ProducItemKiosk {
                Title = "Gói",
                Code = "A65T",
                Note = "* Giá đã bao gồm giá gói, thẻ SIM, phí đấu nối hoà mạng, ...",
                Icon = "http://103.107.182.5:9601/assets/ITEM_A65T_VI.png",
                Description = new () {
                    Title = "Mô tả",
                    Content = [
                        "60GB/30 Ngày (2GB/Ngày)",
                        "Miễn phí 30 phút gọi"]
                },
                Price = new() {
                    Vnd = 300000,
                    Usd = 12.35
                }
            },

        };
    }
    public static ProducItemKiosk[] GetMockItemSimEn()
    {
        return new ProducItemKiosk[] {
            new ProducItemKiosk {
                Title = "Package",
                Code = "A65T",
                Note = "* Includes package price, SIM card, service establishment fee ...",
                Icon = "http://103.107.182.5:9601/assets/ITEM_A65T_EN.png",
                Description = new() {
                    Title = "Description",
                    Content = [
                        "60GB/30 Days (2GB/Day)",
                        "Free 30 calling minutes"]
                },
                Price = new() {
                    Vnd = 300000,
                    Usd = 12.35
                }
            },

        };
    }

}

public class ProducItemKioskContent
{
    public string Title { get; set; } = string.Empty;
    public string[]? Content { get; set; }
}
public class ProducItemKioskPrice
{
    public double Vnd { get; set; }
    public double Usd { get; set; }
}
