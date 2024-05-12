namespace AsimKiosk.Contracts.Product;

public class ChangePriorityRequest
{
    public string ImageKey { get; set; } = string.Empty;
    public int Priority { get; set; }
}
