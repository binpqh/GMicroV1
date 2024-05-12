using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Repositories;
using MongoFramework.Linq;

namespace AsimKiosk.Infrastructure.Persistence.Repositories;

internal class VideoRepository(IUnitOfWork unitOfWork) : GenericRepository<Video>(unitOfWork), IVideoRepository
{
    public async Task<Maybe<Video>> GetByKeyAsync(string key)
        => await UnitOfWork.Set<Video>().FirstOrDefaultAsync(v => v.VideoKey == key);

    public async Task<(List<Video>, int)> GetVideosAsync(int page, int pageSize, string? deviceId, DateTime? from, DateTime? to)
    {
        var videosQuery = UnitOfWork.Set<Video>()
                      .Where(v => (deviceId == null || v.DeviceId == deviceId) &&
                            (from == null || v.CreateAt > from) &&
                            (to == null || v.CreateAt < to))
                      .AsQueryable();

        var videos = await videosQuery
                            .OrderByDescending(v => v.CreateAt)
                            .Skip((page - 1) * pageSize)
                            .Take(pageSize)
                            .ToListAsync();

        var totalCount = videosQuery.Count();

        return (videos, totalCount);
    }
}
