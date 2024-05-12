using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Inventory.WarehouseTicket;
using AsimKiosk.Domain.Core.Primitives;
using Microsoft.AspNetCore.Mvc;

namespace AsimKiosk.Application.Core.Features.Inventory.Query.GetTicketFile;

public class GetTicketFileQuery(string documentKey) : IQuery<Maybe<TicketFileResponse>>
{
    public string DocumentKey { get; set; } = documentKey;
}
