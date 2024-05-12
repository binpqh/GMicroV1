using AsimKiosk.Domain.Core.Abstractions;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Events;
using AsimKiosk.Domain.ValueObject;
using System.ComponentModel.DataAnnotations.Schema;

namespace AsimKiosk.Domain.Entities;

[Table("Kiosk")]
public class Kiosk : AggregateRoot, IAuditableEntity, ISoftDeletableEntity
{
    public Kiosk(string deviceId,
        string? groupId, string kioskName, string? address)
    {
        DeviceId = deviceId;
        GroupId = groupId ?? string.Empty;
        KioskName = kioskName;
        Address = address;
    }
    public string POSCodeTerminal { get; set; } = string.Empty; //Smart POS Code
    public string StoreCode { get; set; } = string.Empty;
    public string DeviceId { get; set; } = null!;
    public string GroupId { get; set; }
    public string? ConfigId { get; set; }
    public string KioskName { get; set; } = string.Empty;
    public string Service { get; set; } = KioskService.All.ToString();
    public string? Address { get; set; }
    public string Status { get; set; } = ActiveStatus.Active.ToString();
    public string ClientIp { get; set; } = string.Empty;
    public string KeyTime { get; set; } = string.Empty;
    public DateTime? DeletedOn { get; set; }
    public DateTime? ModifiedOn { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<Inventory> Inventories { get; set; } = new();
    public List<Peripheral> Peripherals { get; set; } = new();
    public static Kiosk Create(string deviceId,
        string? groupId, string? address)
    {
        var kiosk = new Kiosk(deviceId, groupId, "KioskDefault_" + Guid.NewGuid().ToString("N"), address);
        kiosk.Inventories = new List<Inventory>()
        {
            new Inventory
            {
                DispenserSlot = 1,
                IsActive = true,
            },
            new Inventory
            {
                DispenserSlot = 2,
                IsActive = true,
            },
            new Inventory
            {
                DispenserSlot = 3,
                IsActive = true,
            },
            new Inventory
            {
                DispenserSlot = 4,
                IsActive = true,
            }
        };
        kiosk.Peripherals = new List<Peripheral>()
        {
            new Peripheral
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "Dispenser1",
                Path = "/dev/ttyXR1",
                Code = PeripheralCode.DI1.ToString(),
                Status = ActiveStatus.Active.ToString(),
                Health = HealthStatus.Healthy.ToString(),
            },
            new Peripheral
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "Dispenser2",
                Path = "/dev/ttyXR2",
                Code = PeripheralCode.DI2.ToString(),
                Status = ActiveStatus.Active.ToString(),
                Health = HealthStatus.Healthy.ToString(),
            },
            new Peripheral
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "Dispenser3",
                Path = "/dev/ttyXR3",
                Code = PeripheralCode.DI3.ToString(),
                Status = ActiveStatus.Active.ToString(),
                Health = HealthStatus.Healthy.ToString(),
            },
            new Peripheral
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "Dispenser4",
                Path = "/dev/ttyXR4",
                Code = PeripheralCode.DI4.ToString(),
                Status = ActiveStatus.Active.ToString(),
                Health = HealthStatus.Healthy.ToString(),
            },
            new Peripheral
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "Printer",
                Code = PeripheralCode.PRI.ToString(),
                Status = ActiveStatus.Active.ToString(),
                Health = HealthStatus.Healthy.ToString(),
            },
            new Peripheral
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "UPS",
                Path = "/dev/ttyXR6",
                Code = PeripheralCode.UPS.ToString(),
                Status = ActiveStatus.Active.ToString(),
                Health = HealthStatus.Healthy.ToString(),
            },
            new Peripheral
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "Sensor Temperature",
                Code = PeripheralCode.TEM.ToString(),
                Status = ActiveStatus.Active.ToString(),
                Health = HealthStatus.Healthy.ToString(),
            },
            new Peripheral
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "Locker",
                Code = PeripheralCode.LOC.ToString(),
                Status = ActiveStatus.Active.ToString(),
                Health = HealthStatus.Healthy.ToString(),
            },
        };
        kiosk.AddDomainEvent(new KioskCreatedDomainEvent(kiosk));
        return kiosk;
    }
}
