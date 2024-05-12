using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Contracts.Kiosk.Config;
using AsimKiosk.Contracts.Product.ConfigKiosk;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.KioskApplication.Queries.GetConfigKiosk;

public class GetConfigKioskQueryHandler(
    IKioskRepository kioskRepository,
    IBannerRepository bannerRepository,
    IProductRepository productRepository,
    IKioskIdentifierProvider kioskIdentifierProvider,
    IPaymentMethodRepository paymentMethodRepository,
    IInstructionVideoRepository instructionVideoRepository)
    : IQueryHandler<GetConfigKioskQuery, Maybe<KioskConfigResult>>
{

    public async Task<Maybe<KioskConfigResult>> Handle(GetConfigKioskQuery request, CancellationToken cancellationToken)
    {
        var kiosk = await kioskRepository.GetActiveKioskByAndroidIdAsync(kioskIdentifierProvider.DeviceId);
        if (kiosk.HasNoValue)
        {
            return Maybe<KioskConfigResult>.None;
        }

        var productsRaw = await productRepository.GetAllAsync();
        KioskPaymentMethod[] kioskPaymentMethodArr = [];

        try
        {
            kioskPaymentMethodArr = (await paymentMethodRepository.GetPaymentMethodsAsync(cancellationToken))
            .SelectMany(pm => pm.PaymentProducts
                .Select(pp => new KioskPaymentMethod
                {
                    ProductCode = pp.ProductCode,
                    ProductName = pp.ProductName,
                    BankCodes = pp.PaymentBankCodes.Select(pbc => new KioskPaymentMethod.BankCode
                    {
                        Code = pbc.BankCode,
                        Name = pbc.BankName,
                        Icon = pbc.Icon
                    }).ToArray()
                }))
            .GroupBy(kpm => new { kpm.ProductCode, kpm.ProductName })
            .Select(group => new KioskPaymentMethod
            {
                ProductCode = group.Key.ProductCode,
                ProductName = group.Key.ProductName,
                BankCodes = group.SelectMany(kpm => kpm.BankCodes).ToArray()
            })
            .ToArray();
        }
        catch
        {
            // TODO: handle exception not-found, show log error
            // continue without payment methods
        }
        var banners = await bannerRepository.GetAllActiveAsync();
        var inventories = kiosk.Value.Inventories.ToArray();
        var extDevices = kiosk.Value.Peripherals.Where(e => e.Status == ActiveStatus.Active.ToString()).Where(e => e.Code.ToUpper().StartsWith("DI")).Select(e =>
        {
            var item = inventories.FirstOrDefault(s => "DI" + s.DispenserSlot == e.Code.ToUpper());
            return new Peripheral
            {
                Code = e.Code,
                Name = e.Name,
                Path = e.Path,
                ItemCode = item?.ItemCode
            };
        })
        .ToArray();
        var urlInstructionVideo = await instructionVideoRepository.GetActiveVideoAsync();
        return new KioskConfigResult
        {
            PaymentTypeAvailables = kioskPaymentMethodArr,
            Config = new(),
            Banners = banners.OrderBy(e => e.Priority).Select(e => e.ImageKey).ToArray(),
            Icon = kioskIdentifierProvider.HostUrl + "/assets/LOGO_HEADER.png", // "http://103.107.182.5:9601/assets/LOGO_HEADER.png",
            Products = GetProductConfigKioskResult.InitData([.. productsRaw.Value.Entities], kioskIdentifierProvider.HostUrl),
            ExtDevices = extDevices,
            ActiveSimInfo = new ActiveSim("https://apps.apple.com/vn/app/mylocal-vn/id1543101669?l=vi", urlInstructionVideo.HasNoValue ? "http://103.107.182.5:9601/Resources/Videos/rk30sdk_1707121083940.mp4" : urlInstructionVideo.Value.VideoUrl),
        };
    }

    // public async Task<Maybe<KioskConfigResponse>> Handle(GetKioskConfigByDeviceIdQuery request, CancellationToken cancellationToken)
    // {   
    //     //TODO
    //     //List allowed payment method from record
    //     //List products which has allowed to sell on kiosk => in this product its gonna be contains whole of content,image,icon belong to it
    //     if(!await _kioskRepository.IsKioskExistWithDeviceId(request.DeviceId))
    //     {
    //         return Maybe<KioskConfigResponse>.None;
    //     }    
    //     var kiosk = await _kioskRepository.GetActiveKioskByAndroidIdAsync(request.DeviceId);
    //     if (kiosk.HasNoValue)
    //     {
    //         return Maybe<KioskConfigResponse>.None;
    //     }
    //     var kioskPaymentMethodArr = kiosk.Value.PaymentMethods
    //         .SelectMany(pm => pm.PaymentProducts
    //             .Select(pp => new KioskPaymentMethod
    //             {
    //                 ProductCode = pp.ProductCode,
    //                 ProductName = pp.ProductName,
    //                 BankCodes = pp.PaymentBankCodes.Select(pbc => new KioskPaymentMethod.BankCode
    //                 {
    //                     Code = pbc.BankCode,
    //                     Name = pbc.BankName,
    //                     Icon = pbc.Icon
    //                 }).ToArray()
    //             }))
    //         .GroupBy(kpm => new { kpm.ProductCode, kpm.ProductName })
    //         .Select(group => new KioskPaymentMethod
    //         {
    //             ProductCode = group.Key.ProductCode,
    //             ProductName = group.Key.ProductName,
    //             BankCodes = group.SelectMany(kpm => kpm.BankCodes).ToArray()
    //         })
    //         .ToArray();
    //     var response = new KioskConfigResponse(kiosk.Value.Service.ToString(),
    //         kioskPaymentMethodArr);
    //     return response;
    // }
}
