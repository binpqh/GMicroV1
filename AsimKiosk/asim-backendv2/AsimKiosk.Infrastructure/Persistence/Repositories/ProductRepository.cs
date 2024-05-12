using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Repositories;
using AsimKiosk.Domain.ValueObject;
using AsimKiosk.Infrastructure.Persistence.Specifications;
using MongoDB.Bson;
using MongoFramework.Linq;

namespace AsimKiosk.Infrastructure.Persistence.Repositories
{
    internal class ProductRepository(IUnitOfWork unitOfWork)
        : GenericRepository<Product>(unitOfWork), IProductRepository
    {
        public async Task<Maybe<Product>> GetByProductCodeAsync(string productCode)
            => await UnitOfWork.Set<Product>().FirstOrDefaultAsync(p => p.ProductCode == productCode);

        public async Task<Maybe<Item>> GetItemByCodeAsync(string itemCode)
            => await UnitOfWork.Set<Product>()
                .SelectMany(p => p.VietnameseContent.Items)
                .Where(i => i.CodeItem == itemCode)
                .FirstOrDefaultAsync();

        public async Task<Maybe<Product>> GetProductByItemCodeAsync(string itemCode)
            => await UnitOfWork.Set<Product>().Where(p => p.VietnameseContent.Items.Any(i => i.CodeItem == itemCode)).FirstOrDefaultAsync();

        public async Task<bool> IsProductExistAsync(string productCode)
            => await AnyAsync(new ProductWithCodeSpecification(productCode));

    }
}
