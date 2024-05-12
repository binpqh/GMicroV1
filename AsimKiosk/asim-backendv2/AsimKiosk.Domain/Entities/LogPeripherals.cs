using AsimKiosk.Domain.Core.Abstractions;
using AsimKiosk.Domain.Core.Primitives;
using System.ComponentModel.DataAnnotations.Schema;

namespace AsimKiosk.Domain.Entities;

/// <summary>
/// Author: Nguyen CT
/// </summary>
[Table("LogPeripherals")]
public class LogPeripherals<TData> : Entity, IAuditableEntity
{
    public string DeviceId { get; set; } = string.Empty;
    public string IdPeripherals { get; set; } = string.Empty;
    public string TypeLog { get; set; } = string.Empty;
    public TData? Data { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ModifiedOn { get; set; }
}

/// <summary>
/// Author: Nguyen CT
/// </summary>
public class Ups
{
    public string BateryLevel { get; set; } = string.Empty;
    public string ConsumedLoad { get; set; } = string.Empty;
    public string BatteryVoltage { get; set; } = string.Empty;
    public string InputVoltage { get; set; } = string.Empty;
    public string OutPutVoltage { get; set; } = string.Empty;
    public string FrequencyOutput { get; set; } = string.Empty;
}

/// <summary>
/// Author: Nguyen CT
/// </summary>
public class Temperture
{
    public string TempertureNow { get; set; } = string.Empty;
}

/// <summary>
/// Author: Nguyen CT
/// </summary>
public class Printer
{
    public bool PaperEmpty { get; set; } = false;
    public bool WarningPaper { get; set; } = false;
}