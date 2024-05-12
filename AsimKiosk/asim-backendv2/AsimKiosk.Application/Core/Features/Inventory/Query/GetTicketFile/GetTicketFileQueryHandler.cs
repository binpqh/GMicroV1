using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Inventory.WarehouseTicket;
using AsimKiosk.Domain.Core.Primitives;
using Microsoft.AspNetCore.Mvc;

namespace AsimKiosk.Application.Core.Features.Inventory.Query.GetTicketFile;

public class GetTicketFileQueryHandler : IQueryHandler<GetTicketFileQuery, Maybe<TicketFileResponse>>
{
    public async Task<Maybe<TicketFileResponse>> Handle(GetTicketFileQuery request, CancellationToken cancellationToken)
    {
        var filePath = Path.Combine(Directory.GetCurrentDirectory(), $"Resources/Documents/{request.DocumentKey}");
        if (!File.Exists(filePath))
        {
            return Maybe<TicketFileResponse>.None;
        }
        return await Task.Run(() => GetFile(filePath));
    }
    private TicketFileResponse GetFile(string filePath)
    {
        var stream = new MemoryStream(File.ReadAllBytes(filePath));
        var contentType = "application/pdf";
        var fileName = Path.GetFileName(filePath);

        var response = new TicketFileResponse
        {
            Stream = stream,
            ContentType = contentType,
            FileName = fileName
        };

        return response;
    }
}
