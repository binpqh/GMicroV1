using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Report;

namespace AsimKiosk.Application.Core.Features.Report.Queries.Order.ExportOrderReport;

public class ExportOrderReportQuery(List<ReportOrders> data) : IQuery<ReportFileResponse>
{
    public List<ReportOrders> RowData { get; set; } = data;
}
