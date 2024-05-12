using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using AsimKiosk.Infrastructure.Persistence.Specifications;
using MongoDB.Driver.Linq;
using MongoFramework.Linq;

namespace AsimKiosk.Infrastructure.Persistence.Repositories
{
    internal class OrderRepository(IUnitOfWork unitOfWork) : GenericRepository<Order>(unitOfWork), IOrderRepository
    {
        public async Task<bool> CheckOrderIsExistAsync(string orderCode)
            => await AnyAsync(new OrderWithOrderCodeSpecification(orderCode));

        public async Task<int> CountAsync(CancellationToken cancellation)
            => await UnitOfWork.Set<Order>().CountAsync(cancellation);

        public async Task<Maybe<Order>> GetOrderByOrderCodeAsync(string orderCode)
            => await UnitOfWork.Set<Order>().FirstOrDefaultAsync(o => o.OrderCode == orderCode);

        public async Task<(List<Order>, int, double)> GetPaginateAsync(
            int pageNumber,
            int pageSize,
            List<string> itemCodes,
            List<string> deviceIds,
            string[]? paymentTypeOrderCode,
            OrderStatus? status,
            DateTime dateFrom, 
            DateTime dateTo)
        {
            var query = UnitOfWork.Set<Order>().AsQueryable();
            if (itemCodes.Count > 0) query = query.Where(o => itemCodes.Contains(o.ItemCode));

            if (deviceIds.Count > 0) query = query.Where(o => deviceIds.Contains(o.DeviceId));

            if (status.HasValue && status != OrderStatus.All) query = query.Where(o => o.StatusOrder == status.ToString());

            if (paymentTypeOrderCode != null) query = query.Where(o => paymentTypeOrderCode.Contains(o.OrderCode));

            query = query.Where(o => o.CreateAtUTC >= dateFrom && o.CreateAtUTC <= dateTo && 
                                     o.Status != ActiveStatus.Deleted.ToString())
                         .OrderByDescending(o => o.CreateAtUTC);

            var result = await query.ToListAsync();
            var totalCount = result.Count;
            var orders = result.Skip((pageNumber - 1) * pageSize)
                               .Take(pageSize)
                               .ToList();
            var sum = result.Where(o => o.StatusOrder == OrderStatus.Success.ToString())
                            .Sum(o => o.TotalMountVND);

            return (orders, totalCount, sum);
        }

        public async Task<List<Order>> GetVNPassInventory(List<string> itemCodes, List<string> deviceIds)
        {
            var query = UnitOfWork.Set<Order>().Where(o => o.StatusOrder == OrderStatus.Success.ToString()).AsQueryable();
            if (itemCodes.Count > 0) query = query.Where(o => itemCodes.Contains(o.ItemCode));

            if (deviceIds.Count > 0) query = query.Where(o => deviceIds.Contains(o.DeviceId));

            var result = await query.OrderByDescending(o => o.CreateAtUTC).ToListAsync();

            return result;
        }

        public async Task Rating(string orderCode, int point)
        {
            var order = await UnitOfWork.Set<Order>().FirstOrDefaultAsync(o => o.OrderCode == orderCode);
            if (order != null)
            {
                order.RatingPoint = point;
            }
        }

        public List<Order> DropdownSearch(string queryString, int number)
        {
            var query = UnitOfWork.Set<Order>().Where(o => o.OrderCode.ToLower().Contains(queryString)).OrderByDescending(o => o.CreateAtUTC).AsQueryable();
            if (number == 0) 
                return query.ToList();
            else 
                return query.Take(number).ToList();    
        }
    }
}