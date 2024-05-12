using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Report;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Domain.ValueObject;

namespace AsimKiosk.Application.Core.Features.Report.Queries.Order.GetOrderReport;

public class GetOrderReportQueryHandler(
        IKioskRepository kioskRepository,
        IOrderRepository orderRepository,
        IUserIdentifierProvider currentUser,
        IProductRepository productRepository,
        IPaymentRepository paymentRepository
    ) : IQueryHandler<GetOrderReportQuery, Maybe<OrderReportResponse>>
{
    public async Task<Maybe<OrderReportResponse>> Handle(GetOrderReportQuery request, CancellationToken cancellationToken)
    {
        var currentGroupId = currentUser.GroupId;
        
        (var orders, var totalCount, var sum) = await GetAllAsync(request, currentGroupId);

        var reports = await Task.WhenAll(orders.Select(async o =>
        {
            var product = await productRepository.GetProductByItemCodeAsync(o.ItemCode);
            var item = await productRepository.GetItemByCodeAsync(o.ItemCode);
            return o.BuildAdapter().AddParameters("ProductName",
                        $"{(product.HasNoValue ? string.Empty : product.Value.ProductName)} " +
                        $"- {(item.HasNoValue ? string.Empty : item.Value.CodeTitle + " " +item.Value.CodeItem)}")
                    .AdaptToType<ReportOrders>();
        }));
        return new OrderReportResponse 
        {
            Reports = new PagedList<ReportOrders>(reports, totalCount, request.Page, request.PageSize),
            TotalPrice = sum,
        };
    }
    private async Task<(List<Domain.Entities.Order>, int, double)> GetAllAsync(GetOrderReportQuery request, string? groupId)
    {
        var orders = new List<Domain.Entities.Order>();
        int totalCount = 0;
        double sum = 0;

        var from = DateTime.Parse(request.Request.From);
        var to = DateTime.Parse(request.Request.To).AddDays(1).AddTicks(-1);

        var kioskLists = new List<string>();
        if (!string.IsNullOrEmpty(groupId) && request.Request.DeviceIds.Count == 0)
        {
            var kiosksInDefaultGroup = await kioskRepository.GetByGroupIdAsync(groupId);
            var idList = kiosksInDefaultGroup.Select(x => x.DeviceId).ToList();
            kioskLists.AddRange(idList);
        }
        else
        {
            kioskLists.AddRange(request.Request.DeviceIds);
        }

        if (request.Request.PaymentMethod != null && request.Request.PaymentMethod != "All")
        {
            var payments = await paymentRepository.GetPaymentsByBankCodeAsync(request.Request.PaymentMethod, from, to);
            var paymentOrderCodes = payments.Select(p => p.OrderCode).ToArray();

            (orders, totalCount, sum) = await orderRepository
            .GetPaginateAsync(request.Page, request.PageSize, request.Request.ItemCode, kioskLists, paymentOrderCodes, request.Request.OrderStatus, from, to);
        }
        else 
        {
            (orders, totalCount, sum) = await orderRepository
            .GetPaginateAsync(request.Page, request.PageSize, request.Request.ItemCode, kioskLists, null, request.Request.OrderStatus, from, to);
        }
        
        return (orders, totalCount, sum);
    }
    
}
