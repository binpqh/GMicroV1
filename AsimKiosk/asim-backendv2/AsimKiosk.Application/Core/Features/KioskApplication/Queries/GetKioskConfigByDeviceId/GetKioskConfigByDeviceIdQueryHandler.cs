using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Features.KioskApplication.Queries.GetConfigByDeviceId;
using AsimKiosk.Contracts.Kiosk;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using static AsimKiosk.Contracts.Kiosk.KioskConfigResponse;

namespace AsimKiosk.Application.Core.Features.KioskApplication.Queries.GetKioskConfigByDeviceId;

public class GetKioskConfigByDeviceIdQueryHandler(
    IKioskRepository kioskRepository,
    IPaymentMethodRepository paymentMethodRepository)
    : IQueryHandler<GetKioskConfigByDeviceIdQuery, Maybe<KioskConfigResponse>>
{
    public async Task<Maybe<KioskConfigResponse>> Handle(GetKioskConfigByDeviceIdQuery request, CancellationToken cancellationToken)
    {   
        //TODO
        //List allowed payment method from record
        //List products which has allowed to sell on kiosk => in this product its gonna be contains whole of content,image,icon belong to it
        if(!await kioskRepository.IsKioskExistWithDeviceIdAsync(request.DeviceId))
        {
            return Maybe<KioskConfigResponse>.None;
        }    
        var kiosk = await kioskRepository.GetActiveKioskByAndroidIdAsync(request.DeviceId);
        if (kiosk.HasNoValue)
        {
            return Maybe<KioskConfigResponse>.None;
        }
        var kioskPaymentMethodArr = ( await paymentMethodRepository.GetPaymentMethodsAsync(cancellationToken))
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
        var response = new KioskConfigResponse(kiosk.Value.Service.ToString(),
            kioskPaymentMethodArr);
        return response;
    }
}
