using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Inventory.WarehouseTicket;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.ValueObject;

namespace AsimKiosk.Application.Core.Features.Inventory.Command.UpdateWarehouseTicket;

public class UpdateWarehouseTicketCommand(string id, UpdateWarehouseTicketRequest request) : ICommand<Result>
{
    public string Id { get; set; } = id;
    public UpdateWarehouseTicketRequest Request { get; set; } = request;
}
