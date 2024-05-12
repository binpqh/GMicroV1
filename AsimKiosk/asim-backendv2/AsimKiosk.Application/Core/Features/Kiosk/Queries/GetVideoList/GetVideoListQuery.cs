using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.Kiosk.Video;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Kiosk.Queries.GetVideoList;

public class GetVideoListQuery(int page, int pageSize, string? deviceId, DateTime from, DateTime to) : IQuery<Maybe<PagedList<VideoResponse>>>
{
    public int Page { get; set; } = page;
    public int PageSize { get; set; } = pageSize;
    public string? DeviceId { get; set; } = deviceId;
    public DateTime From { get; set; } = from.Date;
    public DateTime To { get; set; } = to.AddDays(1).AddTicks(-1);
}
