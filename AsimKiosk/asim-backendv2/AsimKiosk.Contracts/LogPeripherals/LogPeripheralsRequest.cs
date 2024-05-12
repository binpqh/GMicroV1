

using System.Text.Json.Serialization;

namespace AsimKiosk.Contracts.LogPeripherals;

public class LogPeripheralsRequest
{
    public string BateryLevel { get; set; } = string.Empty;
    public string ConsumedLoad { get; set; } = string.Empty;
    public string BatteryVoltage { get; set; } = string.Empty;
    public string InputVoltage { get; set; } = string.Empty;
    public string OutPutVoltage { get; set; } = string.Empty;
    public string FrequencyOutput { get; set; } = string.Empty;

}
public class LogTempertureRequest
{
    public string TempertureNow { get; set; } = string.Empty;

}
public class LogPrinterRequest
{
    public bool WarningPaper { get; set; }
    [JsonIgnore]
    public string? DeviceId { get; set; }
}
public class InPutGetAll
{
    public string DeviceId { get; set; } = string.Empty;
    public string TypeLog {  get; set; } = string.Empty;    
}
