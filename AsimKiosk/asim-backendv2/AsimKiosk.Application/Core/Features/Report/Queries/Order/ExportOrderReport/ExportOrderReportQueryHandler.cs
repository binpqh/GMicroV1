using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Report;

namespace AsimKiosk.Application.Core.Features.Report.Queries.Order.ExportOrderReport;

public class ExportOrderReportQueryHandler : IQueryHandler<ExportOrderReportQuery, ReportFileResponse>
{
    public Task<ReportFileResponse> Handle(ExportOrderReportQuery request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
