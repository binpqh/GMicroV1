using FluentValidation;

namespace AsimKiosk.Application.Core.Features.Report.Queries.Order.GetOrderReport;

public class GetOrderReportValidator : AbstractValidator<GetOrderReportQuery>
{
    public GetOrderReportValidator()
    {
        //RuleFor(x => x.Request.DeviceIds).Must(x => x.Count == 2).WithMessage("The array must always have 2 elements.");
    }
}
