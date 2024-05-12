using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Repositories;

public interface IVideoRepository
{
    Task<Maybe<EntityCollection<Video>>> GetAllAsync();
    Task<Maybe<Video>> GetByIdAsync(string id);
    Task<Maybe<Video>> GetByKeyAsync(string key);
    Task<(List<Video>, int)> GetVideosAsync(int page, int pageSize, string? deviceId, DateTime? from, DateTime? to);
    void Insert(Video video);
    Task RemoveAsync(Video video);
}
