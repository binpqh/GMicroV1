using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Repositories;

public interface IRefreshTokenRepository
{
    Task<bool> CheckValidTokenAsync(string token, string clientIp);
    Task<Maybe<RefreshToken>> GetByUserIdAsync(string userId);
    Task<Maybe<RefreshToken>> GetByClientIPAsync(string clientIp);
    Task<Maybe<RefreshToken>> GetByTokenAndClientIPAsync(string token,string clientIp);
    void Insert(RefreshToken refreshToken);
}
