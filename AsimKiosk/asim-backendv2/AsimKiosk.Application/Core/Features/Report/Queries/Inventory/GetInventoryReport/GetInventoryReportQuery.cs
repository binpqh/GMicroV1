using Amazon.SecurityToken.Model.Internal.MarshallTransformations;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Report;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Report.Queries.Inventory.GetInventoryReport;
public class GetInventoryReportQuery(int page, int pageSize, InventoryReportRequest request) : IQuery<Maybe<InventoryReportResponse>>
{
    public int Page { get; set; } = page;
    public int PageSize { get; set; } = pageSize;
    public InventoryReportRequest Request { get; set; } = new InventoryReportRequest
    {
        ProductCode = request.ProductCode,
        DeviceIds = request.DeviceIds,
        ItemCode = request.ItemCode,
        StorageStatus = request.StorageStatus,
    };
}
