namespace AsimKiosk.Contracts.Inventory.WarehouseTicket;

public class TicketFileResponse
{
    public Stream Stream{ get; set; } = new MemoryStream();
    public string ContentType { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
}
