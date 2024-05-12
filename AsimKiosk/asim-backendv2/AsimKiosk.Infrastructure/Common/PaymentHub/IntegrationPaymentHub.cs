using System.Security.Cryptography;
using AsimKiosk.Application.Core.Abstractions.AsimPaymentHub;
using static AsimKiosk.Infrastructure.Common.PaymentHub.PaymentGateway;
using System.Net;
using Grpc.Net.Client;
using System.Text;
using AsimKiosk.Contracts.Payment.Hub;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Core.Utility;
using static AsimKiosk.Infrastructure.Common.PaymentHub.PaymentConfigService;
using System.Net.Sockets;
using AsimKiosk.Contracts.Payment;
using AsimKiosk.Domain.Core.Errors;
using AsimKiosk.Infrastructure.Common.Cryptography;
using Microsoft.Extensions.Configuration;

namespace AsimKiosk.Infrastructure.Common.PaymentHub;

public class IntegrationPaymentHub : IIntegrationPaymentHub
{
    private readonly PaymentGatewayClient _paymentGatewayClient;
    private readonly PaymentConfigServiceClient _paymentConfigServiceClient;
    public IntegrationPaymentHub(IConfiguration configuration)
    {
        string ipconfig = configuration["PaymentHubConfig:HostUrl"] ?? "http://payment-conf-dev.asimgroup.vn:9060";
        string ipGw = configuration["PaymentHubConfig:GatewayUrl"] ?? "http://payment-gw-dev.asimgroup.vn:9061";
        _paymentGatewayClient = new PaymentGatewayClient(GrpcChannel.ForAddress(ipGw, new GrpcChannelOptions
        {
            DisposeHttpClient = true,
            HttpClient = new HttpClient(new SocketsHttpHandler
            {
                ConnectTimeout = TimeSpan.FromSeconds(90)
            })
        }));
        _paymentConfigServiceClient = new PaymentConfigServiceClient(GrpcChannel.ForAddress(ipconfig));
    }

    public async Task<List<Domain.ValueObject.PaymentMethod>> FetchPaymentMethodAsync(CancellationToken cancellationToken)
    {
        var res = await _paymentConfigServiceClient.GetPaymentMethodAsync(new BankCodeRequest
        {
            ChannelCode = "KIOSK",
            MerchantCode = "PMS1676864853990",
            RequestId = Guid.NewGuid().ToString(),
            DeviceId = Guid.NewGuid().ToString(),
        }, null, null, cancellationToken);

        var paymentMethods = res.Response.PaymentMethods.Select(pm => new Domain.ValueObject.PaymentMethod
        {
            PartnerCode = pm.PartnerCode,
            PartnerName = pm.PartnerName,
            Icon = pm.Icon,
            PaymentProducts = pm.Products.Select(p => new Domain.ValueObject.PaymentMethod.PaymentProduct
            {
                ProductCode = p.ProductCode,
                ProductName = p.ProductName,
                PaymentBankCodes = p.ProductBankCodes.Select(pbc => new Domain.ValueObject.PaymentMethod.PaymentProduct.PaymentBankCode
                {
                    BankCode = pbc.PaymentBankCode.BankCode,
                    BankName = pbc.PaymentBankCode.BankName,
                    Icon = pbc.PaymentBankCode.Icon,
                }).ToList(),
            }).ToList()
        }).ToList();
        return paymentMethods;
    }

    public async Task<Result<RequestPayResponse>> RequestPayAsync(PayRequest req,
        CancellationToken cancellationToken)
    {
        var clientIp = GetIPv4Address();
        var shopId = string.Empty;
        var orderId = string.Empty;
        var requestId = Guid.NewGuid().ToString("N");
        var signature = SignatureMaker.GenerateForPayRequest(req.KeySecret, req.OrderCode,
                                    req.TotalAmount, req.OrderTime, req.ProductCode,
                                    req.ChannelCode, req.IpnUrl, req.RedirectUrl,
                                    req.PartnerCode, req.MerchantCode);
        if (req.TerminalCode is not null)
        {
            shopId = req.ShopId;
            orderId = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        }
        var res = await _paymentGatewayClient.CheckoutAsync(new PaymentRequest
        {
            Order = new Order
            {
                ShopId = shopId,
                OrderId = orderId,
                WebViewUrl = "",
                Code = req.OrderCode, //"ES-202303239f57a",
                TotalAmount = req.TotalAmount,
                IpnParams = "orderCode=" + req.OrderCode + "&totalAmount=" + req.TotalAmount,
                IpnURL = req.IpnUrl,//"http://103.107.182.5:9601/Payment/callBack",
                OrderTime = req.OrderTime,
                RedirectUrl = req.RedirectUrl,//"http://103.107.182.5:9601/KioskHub/callBackPayment",
            },
            Payment = new Payment
            {
                Action = Action.Pay,
                BankCode = req.BankCode,
                Channel = req.ChannelCode,//"WEB",
                Partner = req.PartnerCode,//"APPOTA",
                Product = req.ProductCode,//"EWL",
                Merchant = req.MerchantCode,//"PMS1678867371589", 
                Terminal = req.TerminalCode ?? string.Empty,
                Info = new Info
                {
                    ClientIp = clientIp
                }
            },
            RequestId = requestId,
            DeviceId = req.DeviceId,
            Signature = signature
        }, null, null, cancellationToken);

        if (res.TechnicalMessage != "Success")
        {
            string errorMessage = ErrorCodePaymentHub.GetErrorMessage(res.TechnicalMessage);
            return Result.Failure<RequestPayResponse>(new Error(res.TechnicalMessage, errorMessage));
        }
        return Result.Success(new RequestPayResponse
        {
            OrderId = orderId,
            OrderNo = res.Response.OrderNo,
            TransNo = res.Response.TransNo,
            TotalAmount = res.Response.TotalAmount,
            PayUrl = res.Response.PayUrl,
            QrCodeUrl = res.Response.QrCodeUrl,
            Signature = signature,
            RequestId = requestId,
            ClientIp = clientIp
        });
    }
    public async Task<Result<TransactionResponse>> CheckResultAsync(CheckPayRequest checkPay, CancellationToken cancellationToken)
    {
        var res = await _paymentGatewayClient.CheckAsync(new PaymentRequest
        {
            Order = new Order
            {
                Code = checkPay.OrderCode,
                TransNo = checkPay.TransNo,
                ShopId = "SHOP_02",
                OrderId = checkPay.OrderId,
            },
            Payment = new Payment
            {
                Action = Action.Pay,
                Channel = checkPay.Channel,
                Partner = checkPay.Partner,
                Product = checkPay.Product,
                Merchant = checkPay.Merchant,
                Terminal = checkPay.Terminal
            },
            RequestId = Guid.NewGuid().ToString("N"),
            DeviceId = checkPay.DeviceId,
            Signature = SignatureMaker.GenerateForCheckTransaction(checkPay.Key, checkPay.OrderCode,
            checkPay.TransNo, checkPay.Product, checkPay.Channel, checkPay.Partner, checkPay.Merchant)
        }, null, null, cancellationToken);
        if (res.TechnicalCode == "S200" && res.Response.Status.Value == "00")
        {
            return Result.Success(new TransactionResponse
            {
                OrderNo = res.Response.OrderNo,
                TransNo = res.Response.TransNo,
                Amount = res.Response.Amount,
                Value = res.Response.Status.Value,
                CreatedAt = res.Response.CreatedAt,
                PaidAt = res.Response.PaidAt,
                PartnerCode = res.Response.PartnerCode,
                ApprovalCode = res.Response.ApprovalCode,
                PartnerStatus = res.Response.PartnerStatus,
                PartnerTransNo = res.Response.PartnerTransNo
            });
        }
        else
        {
            return Result.Failure<TransactionResponse>(DomainErrors.Payment.FailTransactionFromPaymentHub(checkPay.TransNo));
        }
    }
    private static string Signature(string key, string orderNo, long totalMount,
        long orderTime, string product, string channel, string ipnUrl, string redirectUrl,
        string partner, string merchantId)
    {
        string signature;
        string privateKeyCheckOut = key.Substring(0, 10);
        string planText = "orderNo=" + orderNo
                        + "&totalAmount=" + totalMount
                        + "&orderTime=" + orderTime
                        + "&product=" + product
                        + "&channel=" + channel
                        + "&ipnUrl=" + ipnUrl
                        + "&redirectUrl=" + redirectUrl
                        + "&partner=" + partner
                        + "&merchantId=" + merchantId;
        using (HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(privateKeyCheckOut)))
        {
            byte[] hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(planText));
            signature = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }
        if (string.IsNullOrWhiteSpace(signature))
        {
            throw new Exception("Generate signature to send pay request failed.");
        }
        return signature;
    }
    private string GetIPv4Address()
    {
        string hostName = Dns.GetHostName();
        IPHostEntry hostEntry = Dns.GetHostEntry(hostName);

        foreach (IPAddress address in hostEntry.AddressList)
        {
            if (address.AddressFamily == AddressFamily.InterNetwork)
            {
                return address.ToString();
            }
        }

        return "127.0.0.1";
    }
}
