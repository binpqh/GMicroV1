using Amazon.Runtime.Internal.Transform;
using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Common;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Contracts.User;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;

namespace AsimKiosk.Application.Core.Features.Kiosk.Queries.GetKioskList;

public class GetKioskListQueryHandler(IKioskRepository kioskRepository, IGroupRepository groupRepository, IUserIdentifierProvider userIdentifierProvider)
    : IQueryHandler<GetKioskListQuery, Maybe<List<KioskResponse>>>
{
    public async Task<Maybe<List<KioskResponse>>> Handle(GetKioskListQuery request, CancellationToken cancellationToken)
    {
        var claims = userIdentifierProvider.Role;
        var groupId = userIdentifierProvider.GroupId;

        List<KioskResponse> response;

        if (claims != null && !(claims.Equals("Administrator") || claims.Equals("Superman")))
        {
            if (string.IsNullOrEmpty(groupId))
            {
                return new List<KioskResponse>();
            }
            var group = await groupRepository.GetByIdAsync(groupId);
            var groupKiosks = await kioskRepository.GetByGroupIdAsync(groupId);
            
            response = groupKiosks.BuildAdapter()
                .AddParameters("GroupName", group.Value.GroupName)
                .AdaptToType<List<KioskResponse>>();
            return response;
        }

        var kiosks = await kioskRepository.GetAllAsync();
        if (!kiosks.Value.Entities.Any())
        {
            return Maybe<List<KioskResponse>>.None;
        }

        var groupsInKiosk = kiosks.Value.Entities.Select(k => k.GroupId).Distinct().ToList();

        groupsInKiosk.RemoveAll(string.IsNullOrEmpty);

        var groups = (await groupRepository.GetAllAsync()).Value.Entities.ToDictionary(g => g.Id.ToString(), v => v.GroupName);

        response = kiosks.Value.Entities
            .OrderBy(x => x.GroupId)
            .Select(k =>
            {
                var groupName = groups.GetValueOrDefault(k.GroupId ?? "", "No Group");
                return k.BuildAdapter().AddParameters("GroupName", groupName).AdaptToType<KioskResponse>();
            }).ToList();
        return response;
    }
}
