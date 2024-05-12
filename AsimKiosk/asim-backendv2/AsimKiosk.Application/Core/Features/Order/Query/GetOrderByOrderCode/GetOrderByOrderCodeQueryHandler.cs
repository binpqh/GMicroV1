using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Order;
using AsimKiosk.Contracts.Product.ConfigKiosk.Item;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Order.Query.GetOrderByOrderCode;

internal class GetOrderByOrderCodeQueryHandler(
    IKioskRepository kioskRepository,
    IOrderRepository orderRepository,
    IGroupRepository groupRepository,
    IProductRepository productRepository,
    IPaymentRepository paymentRepository
    ) : IQueryHandler<GetOrderByOrderCodeQuery, Maybe<OrderDetailResponse>>
{
    public async Task<Maybe<OrderDetailResponse>> Handle(GetOrderByOrderCodeQuery request, CancellationToken cancellationToken)
    {
        var order = await orderRepository.GetOrderByOrderCodeAsync(request.OrderCode);
        if(order.HasNoValue)
        {
            return Maybe<OrderDetailResponse>.None;
        }
        var kiosk = await kioskRepository.GetKioskAndroidIdAsync(order.Value.DeviceId);
        var group = kiosk.HasValue ? await groupRepository.GetByIdAsync(kiosk.Value.GroupId) : Maybe<Domain.Entities.Group>.None;
        var groupName = group.HasValue ? group.Value.GroupName : string.Empty;
        var product = await productRepository.GetProductByItemCodeAsync(order.Value.ItemCode);
        var item = await productRepository.GetItemByCodeAsync(order.Value.ItemCode);
        var payment = await paymentRepository.GetPaymentByOrderCodeAsync(order.Value.OrderCode);
        var paymentStatus = payment.HasNoValue ? "Unknown" : payment.Value.State;
        var paymentMethod = payment.HasNoValue ? string.Empty :
        $"{(payment.Value.BankCode != null ? $"{payment.Value.BankCode}" : "POS")}";
        var paymentDate = payment.HasValue ? payment.Value.FinishedAt.HasValue ? payment.Value.FinishedAt.Value.AddHours(7).ToString("dd/MM/yyyy h:mm:ss tt") : string.Empty: string.Empty;

        var orderItems = new List<OrderItem>();
        for (int i = 0; i < order.Value.Quantity; i++)
        {
            var orderItem = new OrderItem()
            {
                ProductName = $"{product.Value.ProductName} - {item.Value.CodeTitle} {item.Value.CodeItem}",
                Price = item.Value.Price,
            };
            orderItems.Add(orderItem);
        }
        
        return order.Value
            .BuildAdapter()
            .AddParameters("KioskName", kiosk.HasValue ? kiosk.Value.KioskName : string.Empty)
            .AddParameters("GroupName", groupName)
            .AddParameters("ProductName", product.HasValue ? product.Value.ProductName : string.Empty)
            .AddParameters("ItemName", item.HasValue ? item.Value.CodeTitle : string.Empty)
            .AddParameters("PaymentMethod", paymentMethod)
            .AddParameters("PaymentStatus", paymentStatus)
            .AddParameters("PaymentDate", paymentDate)
            .AddParameters("OrderItems", orderItems)
            .AdaptToType<OrderDetailResponse>();
    }
}
