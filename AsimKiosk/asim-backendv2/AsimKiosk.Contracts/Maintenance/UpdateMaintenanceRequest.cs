namespace AsimKiosk.Contracts.Maintenance;

public class UpdateMaintenanceRequest
{
    public string Note {  get; set; } = string.Empty;
    public string Assignee {  get; set; } = string.Empty;
}
