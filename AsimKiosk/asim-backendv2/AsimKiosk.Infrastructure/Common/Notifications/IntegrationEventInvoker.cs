using AsimKiosk.Application.Core.Abstractions.Notification;
using Newtonsoft.Json;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Repositories;
using AsimKiosk.Application.Core.Common;
using MediatR;
using AsimKiosk.Application.Core.Features.Inventory.Command.AddNewCardStorage;
using AsimKiosk.Application.Core.Features.Order.Command.UpdateInventory;
using AsimKiosk.Application.Core.Features.SignalHub;
using AsimKiosk.Application.Core.Features.Notification.Command.CreateNotificationForGroup;
using System.Net.Sockets;

namespace AsimKiosk.Infrastructure.Common.Notifications;

internal class IntegrationEventInvoker(
        IUserRepository userRepository,
        IKioskHub kioskHub,
        IMediator mediator
    )
    : IIntegrationEventInvoker
{
    /// <summary>
    /// While an IntegrationEvent going be Invoke, at Client need to register an
    /// method name "Event" to receive the message
    /// </summary>
    /// <param name="integrationEvent"></param>
    /// <returns></returns>
    public Task Invoke(IIntegrationEvent integrationEvent)
    {
        string payload = JsonConvert.SerializeObject(integrationEvent, typeof(IIntegrationEvent), new JsonSerializerSettings
        {
            TypeNameHandling = TypeNameHandling.Auto
        });
        var eventObject = JsonConvert.DeserializeObject<IIntegrationEvent>(payload);
        var kioskIdProperty = eventObject.GetType().GetProperty("KioskId");
        if (kioskIdProperty is not null)
        {
            //string deviceId = kioskIdProperty.GetValue(eventObject)!.ToString()!;
            //TODO
            // ở đây cần xem lại logic chung cho việc gửi hàm. có thể là ở integrationEvent sẽ chứa 1 object rồi gửi xuống
            // sau đó client sẽ parse ra xem object đó chứa gì và yêu cầu làm việc gì.
            //await _kioskHub.SendSignalToDeviceAsync(deviceId, payload);
        }
        return Task.CompletedTask;
    }

    public async Task NotifyMaintenanceToUserAsync(Domain.Entities.Maintenance maintenance)
    {
        var userName = "System";
        if (maintenance.LogBy.ToLower() != "system")
        {
            var user = await userRepository.GetByIdAsync(maintenance.LogBy);
            userName = user.HasValue ? user.Value.Fullname : string.Empty;
        }
        var createNotiCommand = new CreateNotificationForGroupCommand(maintenance.GroupId,maintenance.LogBy, ParentNavigate.InventoryTicket,
            TypeNotify.Ticket, maintenance.Id.ToString());
        var noti = await mediator.Send(createNotiCommand);
        await kioskHub.NotifyTicketAysnc(noti.Value.GroupId, noti.Value);
    }

    //TODO: Handle VNPass case
    public async Task CreateNewSIMStorageOnWarehouseTicketCompletion(Domain.Entities.WarehouseTicket ticket, int slot)
    {
        List<CardStorage> SIMs = [];
        var productQuantity = ticket.ProductQuantities.Where(p => p.DispenserSlot == slot).First();
        if (productQuantity.From.HasValue && productQuantity.To.HasValue)
        {
           SIMs = SerialGenerator.GenerateSIMSerial(ticket.Id.ToString(), slot, productQuantity.ItemCode, ticket.DeviceId, productQuantity.From.Value, productQuantity.To.Value);
        }

        if (SIMs.Count == 0)
            return;

        var command = new AddNewCardStorageCommand(SIMs);
        await mediator.Send(command);
    }
    public async Task UpdateInventoriesOnOrderAsync(Domain.Entities.Order order, Dictionary<int, List<string>> errorDictionary)
    {
        var command = new UpdateInventoryOnOrderCommand(order, errorDictionary);
        await mediator.Send(command);
    }

    public async Task NotifyWHTicketToUserAysnc(WarehouseTicket ticket)
    {
        var createNotiCommand = new CreateNotificationForGroupCommand(ticket.GroupId, ticket.CreatorId,ParentNavigate.InventoryTicket,
            TypeNotify.Ticket, ticket.Id.ToString());
        var noti = await mediator.Send(createNotiCommand);
        await kioskHub.NotifyTicketAysnc(ticket.GroupId, noti.Value);
    }

    public async Task NotifyProductUpdatedAysnc(Product product,string userModifiedId)
    {
        TypeNotify type;
        if(product.DeletedOn is not null && (DateTime.UtcNow - product.DeletedOn.Value).TotalMinutes <= 1)
        {
            type = TypeNotify.Deleted;
        }else if(product.ModifiedOn is not null && (DateTime.UtcNow - product.ModifiedOn.Value).TotalMinutes <= 1)
        {
            type = TypeNotify.Changes;
        }
        else
        {
            type = TypeNotify.Created;
        }
        var createNotiCommand = new CreateNotificationForGroupCommand(null, userModifiedId, ParentNavigate.Product,
        type, product.Id.ToString());
        var noti = await mediator.Send(createNotiCommand);
        await kioskHub.NotifyTicketAysnc(noti.Value.GroupId, noti.Value);
    }
}

