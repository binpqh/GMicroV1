namespace AsimKiosk.Contracts.Maintenance;

public class MaintenanceResponse
{
    public string Id { get; set; } = string.Empty;
    public string DeviceId { get; set; } = string.Empty;
    public string GroupId { get; set; } = string.Empty;
    public string KioskName { get; set; } = string.Empty;
    public string Assignee { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
    public string LogBy { get; set; } = string.Empty;
    public string? DeviceErrorCode { get; set; }
    public DateTime? FinishAt { get; set; }
    public string MaintenanceState { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } 
}
