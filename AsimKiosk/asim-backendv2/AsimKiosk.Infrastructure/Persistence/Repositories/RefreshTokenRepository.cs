using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Repositories;
using MongoFramework.Linq;

namespace AsimKiosk.Infrastructure.Persistence.Repositories;

internal class RefreshTokenRepository(IUnitOfWork unitOfWork) : GenericRepository<RefreshToken>(unitOfWork), IRefreshTokenRepository
{
    public async Task<bool> CheckValidTokenAsync(string token, string clientIp)
        => await UnitOfWork.Set<RefreshToken>().AnyAsync(r => r.Token == token && r.ClientIPv4 == clientIp);

    public async Task<Maybe<RefreshToken>> GetByClientIPAsync(string clientIp)
        => await UnitOfWork.Set<RefreshToken>().Where(r => r.ClientIPv4 == clientIp).FirstOrDefaultAsync();

    public async Task<Maybe<RefreshToken>> GetByTokenAndClientIPAsync(string token, string clientIp)
        => await UnitOfWork.Set<RefreshToken>().Where(r => r.ClientIPv4 == clientIp && r.Token == token).FirstOrDefaultAsync();

    public async Task<Maybe<RefreshToken>> GetByUserIdAsync(string userId)
        => await UnitOfWork.Set<RefreshToken>().FirstOrDefaultAsync(r => r.UserId == userId);
}
