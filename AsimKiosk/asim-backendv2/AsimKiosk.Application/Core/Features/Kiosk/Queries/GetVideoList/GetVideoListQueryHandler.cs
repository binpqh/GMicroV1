using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.Kiosk.Video;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Kiosk.Queries.GetVideoList;

public class GetVideoListQueryHandler(
        IVideoRepository videoRepository
    ) : IQueryHandler<GetVideoListQuery, Maybe<PagedList<VideoResponse>>>
{
    public async Task<Maybe<PagedList<VideoResponse>>> Handle(GetVideoListQuery request, CancellationToken cancellationToken)
    {
        (var videos, var totalPage) = await videoRepository.GetVideosAsync(request.Page, request.PageSize, request.DeviceId, request.From, request.To);

        var response = videos.Adapt<List<VideoResponse>>();

        return new PagedList<VideoResponse>(response, totalPage, request.Page, request.PageSize);
    }
}