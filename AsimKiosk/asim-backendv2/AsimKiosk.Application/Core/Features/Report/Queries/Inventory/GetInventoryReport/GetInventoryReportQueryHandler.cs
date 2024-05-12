using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Common;
using AsimKiosk.Contracts.Report;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Mapster;

namespace AsimKiosk.Application.Core.Features.Report.Queries.Inventory.GetInventoryReport;

internal class GetInventoryReportQueryHandler(
    IGroupRepository groupRepository,
    ICardStorageRepository cardStorageRepository, 
    IKioskRepository kioskRepository, 
    IOrderRepository orderRepository,
    IUserIdentifierProvider currentUser)
    : IQueryHandler<GetInventoryReportQuery, Maybe<InventoryReportResponse>>
{
    public async Task<Maybe<InventoryReportResponse>> Handle(GetInventoryReportQuery request, CancellationToken cancellationToken)
    {
        var currentGroupId =  currentUser.GroupId;
        var cardDetails = new List<CardDetails>();
        var totalCount = 0;

        var totalCardCount = 0;
        var errorCardCount = 0;
        var soldCardCount = 0;
        var inStorageCardCount = 0;
        var registeredCardCount = 0;

        if (request.Request.ProductCode == "LOCAL_SIM")
        {
            (cardDetails, totalCount) = await GetLOCALSIMAsync(request, currentGroupId);
            (totalCardCount, errorCardCount, inStorageCardCount, soldCardCount, registeredCardCount) = 
                cardStorageRepository.GetInventoryNumbers(request.Request.ItemCode, request.Request.DeviceIds);
        }
        else
        {
            (cardDetails, totalCount) = await GetVNPASSAsync(request, currentGroupId);
            soldCardCount = totalCount;
            (totalCardCount, inStorageCardCount, errorCardCount) = kioskRepository.GetInventoryNumbers(request.Request.ItemCode, request.Request.DeviceIds);
        }

        var lmao = new PagedList<CardDetails>(cardDetails, totalCount, request.Page, request.PageSize);
        return new InventoryReportResponse
        {
            Reports = lmao,
            ErrorAmount = errorCardCount,
            InStorageAmount = inStorageCardCount,
            RegisteredAmount = registeredCardCount,
            SoldAmount = soldCardCount,
            TotalAmount = totalCardCount,
        };
    }
    private async Task<(List<CardDetails>, int)> GetLOCALSIMAsync(GetInventoryReportQuery request, string? groupId)
    {
        var results = new List<Domain.Entities.CardStorage>();
        int total = 0;

        var kioskLists = new List<string>();
        if (!string.IsNullOrEmpty(groupId) && request.Request.DeviceIds.Count == 0)
        {
            var kiosksInDefaultGroup = await kioskRepository.GetByGroupIdAsync(groupId);
            var idList = kiosksInDefaultGroup.Select(x => x.DeviceId).ToList();
            kioskLists.AddRange(idList);
        }
        else
        {
            kioskLists.AddRange(request.Request.DeviceIds);
        }

        (results, total) = await cardStorageRepository.GetInventoryReportAsync( 
            request.Page, request.PageSize, request.Request.ItemCode, kioskLists, request.Request.StorageStatus);

        var response = results.Select(c =>
        {
            var kiosk = kioskRepository.GetKioskAndroidIdAsync(c.DeviceId).Result;
            var kioskName = kiosk.Value.KioskName;
            var groupName = groupRepository.GetGroupNameById(kiosk.Value.GroupId);
            return c.BuildAdapter().AddParameters("GroupName", groupName).AddParameters("KioskName", kioskName).AdaptToType<CardDetails>();
        }).ToList();
        return (response, total);
    }
    private async Task<(List<CardDetails>, int totalCount)> GetVNPASSAsync(GetInventoryReportQuery request, string? groupId)
    {
        var kioskLists = new List<string>();
        if (!string.IsNullOrEmpty(groupId) && request.Request.DeviceIds.Count == 0)
        {
            var kiosksInDefaultGroup = await kioskRepository.GetByGroupIdAsync(groupId);
            var idList = kiosksInDefaultGroup.Select(x => x.DeviceId).ToList();
            kioskLists.AddRange(idList);
        }
        else
        {
            kioskLists.AddRange(request.Request.DeviceIds);
        }

        var orders = await orderRepository.GetVNPassInventory(request.Request.ItemCode, kioskLists);
        Func<Domain.Entities.Order, IEnumerable<CardDetails>> mapToCardDetails = order =>
        {
            return order.SerialNumber.Select(serial =>
            {
                var kiosk = kioskRepository.GetKioskAndroidIdAsync(order.DeviceId).Result;
                var groupName = groupRepository.GetGroupNameById(kiosk.Value.GroupId);
                return new CardDetails
                {
                    DeviceId = order.DeviceId,
                    KioskName = kiosk.Value.KioskName,
                    GroupName = groupName,
                    ItemCode = order.ItemCode,
                    SerialNumber = serial,
                    Slot = 0,
                    StorageState = "Sold",
                    ModifiedOn = order.CompleteOn,
                    CreatedAt = order.CreateAtUTC
                };
            });
        };

        // Map each order to a list of CardDetails and flatten the result
        List<CardDetails> results = orders.SelectMany(mapToCardDetails).ToList();
        var total = results.Count;
        var response = results.Skip(request.Page - 1).Take(request.PageSize).ToList();

        return (response, total);
    }
}
