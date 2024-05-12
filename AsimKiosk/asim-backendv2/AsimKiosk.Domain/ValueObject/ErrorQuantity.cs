using AsimKiosk.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace AsimKiosk.Domain.ValueObject;

public class ErrorQuantity
{
    public string ItemCode { get; set; } = string.Empty;
    [Range(1, 4)]
    public int DispenserSlot { get; set; }
    public int Quantity { get; set; }
    public List<string> ErrorSerialNumbers { get; set; } = [];
    public string? AssigneeId { get; set; } // assigned when completed
    public DateTime? FinishedAt { get; set; }
    public string CompletionState { get; set; } = CompletionStatus.Pending.ToString();
    public string? ConfirmationImageKey { get; set; }
}
