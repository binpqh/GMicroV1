using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.ValueObject;

namespace AsimKiosk.Domain.Repositories;

public interface IProductRepository
{
    /// <summary>
    /// Gets the product with the specified identifier.
    /// </summary>
    /// <param name="productId"></param>
    /// <returns>The maybe instance that may contain the product with the specified identifier.</returns>
    Task<Maybe<Product>> GetByIdAsync(string productId);
    Task<Maybe<Product>> GetByProductCodeAsync(string productCode);
    Task<Maybe<Item>> GetItemByCodeAsync(string itemCode);
    Task<Maybe<Product>> GetProductByItemCodeAsync(string itemCode);
    Task<Maybe<EntityCollection<Product>>> GetAllAsync();
    Task<bool> IsProductExistAsync(string productCode);
    void Insert(Product product);
    Task RemoveAsync(Product product);
}
