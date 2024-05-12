using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Application.Core.Common;

public static class NotificationHelper
{
    public static (string englishDesc, string vietnameseDesc) GetDescription(TypeNotify notifyType, ParentNavigate parentNavigate, string userName)
    {
        string englishDesc = "";
        string vietnameseDesc = "";
        var user = string.IsNullOrEmpty(userName) ? "System" : userName;
        switch (notifyType)
        {
            case TypeNotify.Default:
                englishDesc = $"{user} has received a notification.";
                vietnameseDesc = $"{user} đã nhận được một thông báo";
                break;
            case TypeNotify.Created:
                englishDesc = $"{user} has created a new {GetParentNavigateDescription(parentNavigate)}.";
                vietnameseDesc = $"{user} đã tạo mới một đối tượng {GetParentNavigateDescription(parentNavigate)}.";
                break;
            case TypeNotify.Deleted:
                englishDesc = $"{user} has deleted a {GetParentNavigateDescription(parentNavigate)}.";
                vietnameseDesc = $"{user} đã xóa một đối tượng {GetParentNavigateDescription(parentNavigate)}.";
                break;
            case TypeNotify.Changes:
                englishDesc = $"{user} has made changes to a {GetParentNavigateDescription(parentNavigate)}.";
                vietnameseDesc = $"{user} đã thay đổi một đối tượng {GetParentNavigateDescription(parentNavigate)}.";
                break;
            case TypeNotify.Ticket:
                englishDesc = $"{user} has created a {GetParentNavigateDescription(parentNavigate)} ticket.";
                vietnameseDesc = $"{user} đã tạo một phiếu {GetParentNavigateDescription(parentNavigate)}.";
                break;
            case TypeNotify.OutCardIssue:
                englishDesc = $"{user} has issued an out card related to {GetParentNavigateDescription(parentNavigate)}.";
                vietnameseDesc = $"{user} đã phát hành một thẻ ra ngoài liên quan đến {GetParentNavigateDescription(parentNavigate)}.";
                break;
            case TypeNotify.FailOrder:
                englishDesc = $"{user}'s order has failed related to {GetParentNavigateDescription(parentNavigate)}.";
                vietnameseDesc = $"Đơn đặt hàng của {user} đã thất bại liên quan đến {GetParentNavigateDescription(parentNavigate)}.";
                break;
            case TypeNotify.ErrorTray:
                englishDesc = $"{user} has encountered a tray error related to {GetParentNavigateDescription(parentNavigate)}.";
                vietnameseDesc = $"{user} đã gặp phải lỗi với một khay liên quan đến {GetParentNavigateDescription(parentNavigate)}.";
                break;
            case TypeNotify.WarningQuantityThreshold:
                englishDesc = $"{user} has reached a warning quantity threshold related to {GetParentNavigateDescription(parentNavigate)}.";
                vietnameseDesc = $"{user} đã đạt đến ngưỡng cảnh báo về số lượng liên quan đến {GetParentNavigateDescription(parentNavigate)}.";
                break;
            default:
                englishDesc = $"{user} has received an unknown notification type.";
                vietnameseDesc = $"{user} đã nhận được một loại thông báo chưa xác định.";
                break;
        }

        return (englishDesc, vietnameseDesc);
    }

    private static string GetParentNavigateDescription(ParentNavigate parentNavigate)
    {
        switch (parentNavigate)
        {
            case ParentNavigate.Product:
                return "Product";
            case ParentNavigate.Kiosk:
                return "Kiosk";
            case ParentNavigate.MaintenanceTicket:
                return "Maintenance ticket";
            case ParentNavigate.InventoryTicket:
                return "Inventory ticket";
            case ParentNavigate.OrderIssue:
                return "Order issue";
            default:
                return "Unknown";
        }
    }
}


