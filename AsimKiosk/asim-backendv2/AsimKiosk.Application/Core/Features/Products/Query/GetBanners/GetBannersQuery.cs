using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Product;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.Products.Query.GetBanners;

public class GetBannersQuery : IQuery<Maybe<List<BannerResponse>>>
{
}