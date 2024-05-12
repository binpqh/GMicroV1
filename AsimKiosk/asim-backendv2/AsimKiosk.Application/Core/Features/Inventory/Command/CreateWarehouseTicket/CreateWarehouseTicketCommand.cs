using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Inventory.WarehouseTicket;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.ValueObject;
using Microsoft.AspNetCore.Http;

namespace AsimKiosk.Application.Core.Features.Inventory.Command.CreateWarehouseTicket;

public class CreateWarehouseTicketCommand(WarehouseTicketRequest request) : ICommand<Result>
{
    public WarehouseTicketRequest Request { get; set; } = request;
}
