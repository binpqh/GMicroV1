using AsimKiosk.Application.Core.Abstractions.AsimPaymentHub;
using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Application.Core.Common;
using AsimKiosk.Contracts.Payment;
using AsimKiosk.Contracts.Payment.Hub;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;
using Microsoft.Extensions.DependencyInjection;
using System.Threading;

namespace AsimKiosk.Application.Core.Features.KioskApplication.Command.RequestPayByOrderCode;

internal class RequestPayByOrderCodeCommandHandler(
    IPaymentRepository paymentRepository,
    IPaymentConfigRepository paymentConfigRepository,
    IPaymentMethodRepository paymentMethodRepository,
    IKioskRepository kioskRepository,
    IOrderRepository orderRepository,
    IIntegrationPaymentHub integrationPaymentHub,
    IKioskIdentifierProvider kioskIdentifierProvider,
    IServiceScopeFactory serviceScopeFactory)
    : ICommandHandler<RequestPayByOrderCodeCommand, Result<RequestPaymentResponse>>
{
    public async Task<Result<RequestPaymentResponse>> Handle(RequestPayByOrderCodeCommand request, CancellationToken cancellationToken)
    {
        var kiosk = await kioskRepository.GetActiveKioskByAndroidIdAsync(kioskIdentifierProvider.DeviceId);
        var paymentConfig = await paymentConfigRepository.GetByChannelKioskAsync();
        var order = await orderRepository.GetOrderByOrderCodeAsync(request.Request.OrderCode);
        var partnerCode = string.IsNullOrEmpty(request.Request.BankCode) ? await paymentMethodRepository.GetPartnerCodeByProductCodeAsync(request.Request.ProductCode, cancellationToken) : await paymentMethodRepository.GetPartnerCodeByBankCodeAsync(request.Request.BankCode!, cancellationToken);

        if (kiosk.HasNoValue)
            return Result.Failure<RequestPaymentResponse>(DomainErrors.General.NotFoundSpecificObject(ObjectName.Kiosk));

        if (paymentConfig.HasNoValue)
            return Result.Failure<RequestPaymentResponse>(DomainErrors.General.NotFoundSpecificObject(ObjectName.PaymentConfiguration));

        if (order.HasNoValue)
            return Result.Failure<RequestPaymentResponse>(DomainErrors.General.NotFoundSpecificObject(ObjectName.Order));

        if (partnerCode.HasNoValue)
            return Result.Failure<RequestPaymentResponse>(DomainErrors.General.NotFoundSpecificObject(ObjectName.PartnerCode));

        var payment = await paymentRepository.GetPaymentByOrderCodeAsync(request.Request.OrderCode);
        if(payment.HasNoValue)
        {
            payment = new Domain.Entities.Payment
            (
                paymentConfig.Value.Id.ToString(),
                request.Request.OrderCode,
                partnerCode.Value,
                kiosk.Value.POSCodeTerminal,
                request.Request.ProductCode,
                request.Request.BankCode
            );
            var res = await RequestPayAsync(payment, order.Value, paymentConfig.Value, serviceScopeFactory, cancellationToken);

            if (res.IsFailure)
            {
                return Result.Failure<RequestPaymentResponse>(res.Error);
            }

            payment.Value.TransactionNumber = res.Value.TransNo;
            payment.Value.TransactionNumber = res.Value.TransNo;
            payment.Value.Signature = res.Value.Signature;
            payment.Value.RequestId = res.Value.RequestId;
            payment.Value.ClientIp = res.Value.ClientIp;
            order.Value.OrderId = res.Value.OrderId;
            paymentRepository.Insert(payment);
            return Result.Success(new RequestPaymentResponse
            {
                TransNo = payment.Value.TransactionNumber,
                PayUrl = !string.IsNullOrEmpty(request.Request.BankCode) ? res.Value.PayUrl : string.Empty,
                TotalAmount = res.Value.TotalAmount
            });
        } else
        {
            var res = await RequestPayAsync(payment, order.Value, paymentConfig.Value, serviceScopeFactory, cancellationToken);

            if (res.IsFailure)
            {
                return Result.Failure<RequestPaymentResponse>(res.Error);
            }

            payment.Value.TransactionNumber = res.Value.TransNo;
            payment.Value.TransactionNumber = res.Value.TransNo;
            payment.Value.Signature = res.Value.Signature;
            payment.Value.RequestId = res.Value.RequestId;
            payment.Value.ClientIp = res.Value.ClientIp;
            order.Value.OrderId = res.Value.OrderId;
            return Result.Success(new RequestPaymentResponse
            {
                TransNo = payment.Value.TransactionNumber,
                PayUrl = !string.IsNullOrEmpty(request.Request.BankCode) ? res.Value.PayUrl : string.Empty,
                TotalAmount = res.Value.TotalAmount
            });
        }
    }
    private async Task<Result<RequestPayResponse>> RequestPayAsync(Domain.Entities.Payment payment,Domain.Entities.Order order,Domain.ValueObject.PaymentConfig paymentConfig, IServiceScopeFactory serviceScopeFactory, CancellationToken cancellationToken)
    {
        PayRequest payRequest = new PayRequest
        {
            BankCode = payment.BankCode ?? string.Empty,
            TerminalCode = payment.ProductCode.ToLower().Contains("pos") ? payment.TerminalCode : string.Empty,
            MerchantCode = paymentConfig.MerchantCode,
            ChannelCode = paymentConfig.ChannelCode,
            OrderCode = order.OrderCode,
            TotalAmount = (long)order.TotalMountVND,
            PartnerCode = payment.PartnerCode,
            ProductCode = payment.ProductCode,
            DeviceId = order.DeviceId,
            CustomerEmail = paymentConfig.CustomerEmail,
            CustomerMobile = paymentConfig.CustomerMobile,
            CustomerName = paymentConfig.CustomerName,
            KeySecret = paymentConfig.KeySecret,
            IpnUrl = paymentConfig.IpnUrl,
            RedirectUrl = paymentConfig.RedirectUrl,
            ShopId = paymentConfig.ShopId
            //TODO chỗ này cần coi lại vì không biêt những paymentMethod nào sẽ cho phép việc thanh toán thông qua máy pos
        };
        //order -> tạo order -> thanh toán với paymentMethod được chọn -> request paymentHub của asim -> call back vào 1 api của bin
        //api đó sẽ là api của hub signalR -> call client với deviceId -> xuống app mua hàng -> hoàn tất thanh toán trả thẻ 
        //-> thao tác trả sim/vnpass phải được theo dõi realtime. nếu stuck -> notify = email qua cho người phụ trách kiosk đó
        var resultPayRequest = await integrationPaymentHub.RequestPayAsync(payRequest, cancellationToken);
        
        if (resultPayRequest.IsFailure)
            return Result.Failure<RequestPayResponse>(resultPayRequest.Error);

        if (payment.ProductCode.ToLower().Contains("pos"))
        {
            var spamPOS = new SpamPOSResult(new CheckPayRequest
            {
                Key = paymentConfig.KeySecret,
                Channel = paymentConfig.ChannelCode,
                Merchant = paymentConfig.MerchantCode,
                Signature = payment.Signature,
                Terminal = payment.TerminalCode,
                Partner = payment.PartnerCode,
                Product = payment.ProductCode,
                OrderCode = payment.OrderCode,
                OrderId = order.OrderId,
                DeviceId = order.DeviceId,
                TotalAmount = (long)order.TotalMountVND,
                ClientIp = payment.ClientIp,
                TransNo = resultPayRequest.Value.TransNo
            }, serviceScopeFactory);

            spamPOS.StartAsync(cancellationToken).Forget();

        }

        return Result.Success(new RequestPayResponse
        {
            OrderId = resultPayRequest.Value.OrderId,
            PayUrl = resultPayRequest.Value.PayUrl,
            TransNo = resultPayRequest.Value.TransNo,
            TotalAmount = resultPayRequest.Value.TotalAmount,
            Signature = resultPayRequest.Value.Signature,
            ClientIp = resultPayRequest.Value.ClientIp,
            RequestId = resultPayRequest.Value.RequestId,
        });
        
    }

}
