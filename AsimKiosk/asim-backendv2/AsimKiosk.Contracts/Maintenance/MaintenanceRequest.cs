namespace AsimKiosk.Contracts.Maintenance;

public class MaintenanceRequest
{
    public string ErrorCode { get; set; } = string.Empty;
    public string DeviceId { get; set; } = string.Empty;
    // public string KioskName { get; set; } = string.Empty;
    
}
public class MantenanceRequestHuman
{
    public string ErrorCode { get; set; } = string.Empty;
    public string DeviceId { get; set; } = string.Empty;
    public string Note {  get; set; } = string.Empty;   
}
