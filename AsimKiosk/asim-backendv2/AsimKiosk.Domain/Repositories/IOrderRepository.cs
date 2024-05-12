using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;

namespace AsimKiosk.Domain.Repositories
{
    public interface IOrderRepository
    {
        Task<int> CountAsync(CancellationToken cancellationToken);
        Task<(List<Order>, int, double)> GetPaginateAsync(
            int pageNumber, 
            int pageSize,
            List<string> itemCodes,
            List<string> deviceIds,
            string[]? paymentTypeOrderCode,
            OrderStatus? status,
            DateTime dateFrom, 
            DateTime dateTo);
        Task<List<Order>> GetVNPassInventory(List<string> itemCodes, List<string> deviceIds);
        List<Order> DropdownSearch(string queryString, int number); 
        Task<Maybe<Order>> GetOrderByOrderCodeAsync(string orderCode);
        Task<bool> CheckOrderIsExistAsync(string orderCode);
        Task Rating(string orderCode, int point);
        void Insert(Order order);
        Task RemoveAsync(Order order);
    }
}