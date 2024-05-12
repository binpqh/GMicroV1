using AsimKiosk.Application.Core.Common;
using AsimKiosk.Contracts.ExternalAPI;
using AsimKiosk.Contracts.Group;
using AsimKiosk.Contracts.Inventory.WarehouseTicket;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Contracts.Kiosk.Peripheral;
using AsimKiosk.Contracts.Kiosk.Video;
using AsimKiosk.Contracts.Notification;
using AsimKiosk.Contracts.Order;
using AsimKiosk.Contracts.Product;
using AsimKiosk.Contracts.Report;
using AsimKiosk.Contracts.User;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.ValueObject;
using Mapster;
using Microsoft.Extensions.DependencyInjection;

namespace AsimKiosk.Infrastructure.Common.Mapping;

public static class MapsterConfig
{
    public static void RegisterMapsterConfiguration(this IServiceCollection services)
    {
        TypeAdapterConfig<Kiosk, KioskResponse>.NewConfig()
            .Map(dest => dest.Name, src => src.KioskName)
            .Map(dest => dest.HealthStatus, src => $"{DeviceHealthCalculator.Calculate(src.Peripherals.Count, src.Peripherals.Where(p => p.Health == "Unhealthy").Count())}%")
            .Map(dest => dest.GroupName, src => MapContext.Current != null ? MapContext.Current.Parameters["GroupName"] : string.Empty);

        TypeAdapterConfig<Inventory, InventoryItem>.NewConfig()
            .Map(dest => dest.Quantity, src => src.InventoryQuantity)
            .Map(dest => dest.SpaceRemaining, src => 250 - src.InventoryQuantity)
            .Map(dest => dest.IsLow, src => src.InventoryQuantity < 20 ? true : false)
            .Map(dest => dest.Active, src => src.IsActive)
            .Map(dest => dest.Quantity, src => src.InventoryQuantity);

        TypeAdapterConfig<Kiosk, KioskGeneralDetails>.NewConfig()
            .Map(dest => dest.Name, src => src.KioskName)
            .Map(dest => dest.HealthStatus, src => $"{DeviceHealthCalculator.Calculate(src.Peripherals.Count, src.Peripherals.Where(p => p.Health == "Unhealthy").Count())}%")
            .Map(dest => dest.ExternalDevices, src => MapContext.Current != null ? MapContext.Current.Parameters["ExternalDevices"] : new List<ExternalDevice>())
            .Map(dest => dest.GroupName, src => MapContext.Current != null ? MapContext.Current.Parameters["GroupName"] : string.Empty);

        TypeAdapterConfig<Kiosk, KioskDetailsResponse>.NewConfig()
            .Map(dest => dest.Name, src => src.KioskName)
            .Map(dest => dest.Inventories, src => src.Inventories.Adapt<List<InventoryKiosk>>())
            .Map(dest => dest.Peripherals, src => src.Peripherals.Adapt<List<PeripheralKiosk>>())
            .Map(dest => dest.HealthStatus, src => $"{DeviceHealthCalculator.Calculate(src.Peripherals.Count, src.Peripherals.Where(p => p.Health == "Unhealthy").Count())}%")
            .Map(dest => dest.GroupName, src => MapContext.Current != null ? MapContext.Current.Parameters["GroupName"] : string.Empty);

        TypeAdapterConfig<Kiosk, KioskInventoryResponse>.NewConfig()
            .Map(dest => dest.Dispensers, src => MapContext.Current != null ? MapContext.Current.Parameters["Dispenser"] : new List<InventoryItem>())
            .Map(dest => dest.GroupName, src => MapContext.Current != null ? MapContext.Current.Parameters["GroupName"] : string.Empty);

        TypeAdapterConfig<Kiosk, KioskDropdownResponse>.NewConfig()
            .Map(dest => dest.GroupName, src => MapContext.Current != null ? MapContext.Current.Parameters["GroupName"] : string.Empty);

        TypeAdapterConfig<Peripheral, PeripheralKiosk>.NewConfig()
            .Map(dest => dest.PeripheralName, src => src.Name)
            .Map(dest => dest.HealStatus, src => src.Health);

        TypeAdapterConfig<Inventory, InventoryKiosk>.NewConfig()
            .Map(dest => dest.Slot, src => src.DispenserSlot);

        TypeAdapterConfig<Group, GroupResponse>.NewConfig()
            .Map(dest => dest.GroupId, src => src.Id.ToString())
            .Map(dest => dest.CreatedAt, src => src.CreatedAt.ToLocalTime())
            .Map(dest => dest.KioskCount, src => MapContext.Current != null ? MapContext.Current.Parameters["KioskCount"] : string.Empty)
            .Map(dest => dest.UserCount, src => MapContext.Current != null ? MapContext.Current.Parameters["UserCount"] : string.Empty)
            .Map(dest => dest.GroupUsers, src => MapContext.Current != null ? MapContext.Current.Parameters["GroupUsers"] : new List<GroupUser>());

        TypeAdapterConfig<User, GroupUser>.NewConfig()
            .Map(dest => dest.ActiveStatus, src => src.Status)
            .Map(dest => dest.UserName, src => src.Username)
            .Map(dest => dest.FullName, src => src.Fullname);

        TypeAdapterConfig<User, UserResponse>.NewConfig()
            .Map(dest => dest.Id, src => src.Id.ToString())
            .Map(dest => dest.ActiveStatus, src => src.Status)
            .Map(dest => dest.UserName, src => src.Username)
            .Map(dest => dest.FullName, src => src.Fullname)
            .Map(dest => dest.GroupName, src => MapContext.Current != null ? MapContext.Current.Parameters["GroupName"] : string.Empty);

        TypeAdapterConfig<Group, GroupDropdownResponse>.NewConfig()
            .Map(dest => dest.GroupId, src => src.Id.ToString());

        TypeAdapterConfig<ExternalAPI, ExternalAPIResponse>.NewConfig()
            .Map(dest => dest.Id, src => src.Id.ToString())
            .Map(dest => dest.RequestType, src => src.RequestType.ToString());

        TypeAdapterConfig<HistoryPeripheral, PeripheralLogResponse>.NewConfig()
            .Map(dest => dest.Description, src => src.Description ?? string.Empty)
            .Map(dest => dest.Level, src => src.Severity.ToString())
            .Map(dest => dest.Timestamp, src => src.CreatedAt.ToLocalTime());

        TypeAdapterConfig<WarehouseTicket, WarehouseTicketResponse>.NewConfig()
            .Map(dest => dest.Id, src => src.Id.ToString())
            .Map(dest => dest.DispenserCount, src => src.ProductQuantities.Where(p => p.CompletionState != "Disabled").Count())
            .Map(dest => dest.KioskName, src => MapContext.Current != null ? MapContext.Current.Parameters["KioskName"] : string.Empty)
            .Map(dest => dest.CreatorName, src => MapContext.Current != null ? MapContext.Current.Parameters["CreatorName"] : string.Empty)
            .Map(dest => dest.GroupName, src => MapContext.Current != null ? MapContext.Current.Parameters["GroupName"] : string.Empty);

        TypeAdapterConfig<WarehouseTicket, WarehouseTicketDetails>.NewConfig()
            .Map(dest => dest.Id, src => src.Id.ToString())
            .Ignore(dest => dest.DocumentKey)
            .Map(dest => dest.DispenserCount, src => src.ProductQuantities.Where(p => p.CompletionState != "Disabled").Count())
            .Map(dest => dest.KioskName, src => MapContext.Current != null ? MapContext.Current.Parameters["KioskName"] : string.Empty)
            .Map(dest => dest.CreatorName, src => MapContext.Current != null ? MapContext.Current.Parameters["CreatorName"] : string.Empty)
            .Map(dest => dest.GroupName, src => MapContext.Current != null ? MapContext.Current.Parameters["GroupName"] : string.Empty)
            .Map(dest => dest.ProductQuantities, src => MapContext.Current != null ? MapContext.Current.Parameters["ProductQuantities"] : new List<ProductQuantityResponse>());

        TypeAdapterConfig<Video, VideoResponse>.NewConfig()
            .Map(dest => dest.CreatedAt, src => src.CreateAt);

        TypeAdapterConfig<Order, OrderDetailResponse>.NewConfig()
            .Map(dest => dest.KioskName, src => MapContext.Current != null ? MapContext.Current.Parameters["KioskName"] : string.Empty)
            .Map(dest => dest.GroupName, src => MapContext.Current != null ? MapContext.Current.Parameters["GroupName"] : string.Empty)
            .Map(dest => dest.ProductName, src => MapContext.Current != null ? MapContext.Current.Parameters["ProductName"] : string.Empty)
            .Map(dest => dest.PaymentMethod, src => MapContext.Current != null ? MapContext.Current.Parameters["PaymentMethod"] : string.Empty)
            .Map(dest => dest.PaymentStatus, src => MapContext.Current != null ? MapContext.Current.Parameters["PaymentStatus"] : string.Empty)
            .Map(dest => dest.CreatedAt, src => src.CreateAtUTC.AddHours(7).ToString("dd/MM/yyyy h:mm:ss tt"))
            .Map(dest => dest.PaymentDate, src => MapContext.Current != null ? MapContext.Current.Parameters["PaymentDate"] : string.Empty)
            .Map(dest => dest.OrderItems, src => MapContext.Current != null ? MapContext.Current.Parameters["OrderItems"] : new List<OrderItem>())
            .Map(dest => dest.LogProcessOrder, src => src.LogProcessOrder.OrderBy(o => o.CreatedAt))
            .Map(dest => dest.ItemName, src => MapContext.Current != null ? MapContext.Current.Parameters["ItemName"] : string.Empty);

        TypeAdapterConfig<Order, ReportOrders>.NewConfig()
            //.Map(dest => dest.StoreCode, src => MapContext.Current != null ? MapContext.Current.Parameters["StoreCode"] : string.Empty)
            .Map(dest => dest.ProductName, src => MapContext.Current != null ? MapContext.Current.Parameters["ProductName"] : string.Empty)
            .Map(dest => dest.Price, src => src.TotalMountVND);

        TypeAdapterConfig<User, UserGroupResponse>.NewConfig()
            .Map(dest => dest.FullName, src => src.Fullname);

        TypeAdapterConfig<CardStorage, CardDetails>.NewConfig()
            .Map(dest => dest.SerialNumber, src => src.SerialNumber.ToString())
            .Map(dest => dest.GroupName, src => MapContext.Current != null ? MapContext.Current.Parameters["GroupName"] : string.Empty)
            .Map(dest => dest.KioskName, src => MapContext.Current != null ? MapContext.Current.Parameters["KioskName"] : string.Empty);
        TypeAdapterConfig<Notification, NotificationResponse>.NewConfig()
            .Map(dest => dest.UnreadNumber, src => MapContext.Current != null ? MapContext.Current.Parameters["UnreadNumber"] : 0);
    }
}
