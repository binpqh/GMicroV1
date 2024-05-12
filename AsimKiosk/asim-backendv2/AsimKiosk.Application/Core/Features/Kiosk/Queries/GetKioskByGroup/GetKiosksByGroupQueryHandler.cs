using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Kiosk.Queries.GetKioskByGroup;

public class GetKiosksByGroupQueryHandler(
    IKioskRepository kioskRepository,
    IUserIdentifierProvider currentUser)
    : IQueryHandler<GetKiosksByGroupQuery, Maybe<PagedList<KioskResponse>>>
{
    public async Task<Maybe<PagedList<KioskResponse>>> Handle(GetKiosksByGroupQuery request, CancellationToken cancellationToken)
    {
        
        if (currentUser.Role!.Equals("User") && currentUser.GroupId == null)
        {
            return Maybe<PagedList<KioskResponse>>.None;
        }

        var kiosks = await kioskRepository.GetByGroupIdAsync(!string.IsNullOrEmpty(currentUser.GroupId) ? currentUser.GroupId : request.GroupId);
        var response = kiosks.Adapt<List<KioskResponse>>();

        return new PagedList<KioskResponse>(response, response.Count, request.Page, request.PageSize);
    }
}
