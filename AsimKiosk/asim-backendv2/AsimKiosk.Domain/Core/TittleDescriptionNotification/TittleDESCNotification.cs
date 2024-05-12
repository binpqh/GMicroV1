namespace AsimKiosk.Domain.Core.TittleDescriptionNotification;

public static class TittleDESCNotification
{
    public static (string, string) DoneTicketByUser(string userFullName)
        => ($"There is a ticket has been completed by {userFullName}.", $"Có một phiếu được hoàn thành bởi {userFullName}.");
    public static (string,string) NotifyInventoryTicketByUser(string userFullName) 
        => ($"There is an inventory ticket has been created by {userFullName}.",$"Có một phiếu nhập kho được tạo bởi {userFullName}.");
    public static (string, string) NotifyMaintenanceTicketByKiosk(string kioskName)
        => ($"There is a maintenance ticket has been created by Kiosk : {kioskName}.", $"Có một phiếu bảo trì được tạo bởi Kiosk : {kioskName}.");
}
