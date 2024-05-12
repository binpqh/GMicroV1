using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Report;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Application.Core.Features.Report.Queries.Order.GetOrderReport;

public class GetOrderReportQuery(
    int page,
    int pageSize,
    ReportRequest request
    ) : IQuery<Maybe<OrderReportResponse>>
{
    public int Page { get; set; } = page;
    public int PageSize { get; set; } = pageSize;
    public ReportRequest Request { get; set; } = new ReportRequest
    {
        ItemCode = request.ItemCode,
        PaymentMethod = request.PaymentMethod,
        DeviceIds = request.DeviceIds,
        OrderStatus = request.OrderStatus,
        From = request.From,
        To = request.To,
    };
}
