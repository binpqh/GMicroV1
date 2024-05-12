using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Application.Core.Abstractions.Notification
{
    public interface IIntegrationEventInvoker
    {
        Task Invoke(IIntegrationEvent integrationEvent);
        Task NotifyMaintenanceToUserAsync(Maintenance maintenance);
        Task CreateNewSIMStorageOnWarehouseTicketCompletion(WarehouseTicket ticket, int slot);
        Task NotifyWHTicketToUserAysnc(WarehouseTicket warehouse);
        Task UpdateInventoriesOnOrderAsync(Order order, Dictionary<int, List<string>> errorDictionary);
        Task NotifyProductUpdatedAysnc(Product product,string userModifiedId);
    }
}
