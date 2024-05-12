using AsimKiosk.Application.Core.Errors;
using AsimKiosk.Application.Core.Extensions;
using FluentValidation;

namespace AsimKiosk.Application.Core.Features.Report.Queries.Order.ExportOrderReport;

public class ExportOrderReportValidator : AbstractValidator<ExportOrderReportQuery>
{
    public ExportOrderReportValidator()
    {
        RuleFor(x => x.RowData).Must(x => x.Count > 0).WithError(ValidationErrors.Report.RowDataEmpty);
    }
}
