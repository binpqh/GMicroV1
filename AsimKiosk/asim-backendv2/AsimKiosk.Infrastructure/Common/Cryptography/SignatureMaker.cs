using System.Security.Cryptography;
using System.Text;

namespace AsimKiosk.Infrastructure.Common.Cryptography;
public static class SignatureMaker
{
    public static string GenerateForPayRequest(string key, string orderNo, long totalMount,
        long orderTime, string product, string channel, string ipnUrl, string redirectUrl,
        string partner, string merchantId)
    {
        var signature = string.Empty;
        if (key.Length >= 10)
        {
            var privateKeyCheckOut = key[..10];
            var planText = "orderNo=" + orderNo
                                      + "&totalAmount=" + totalMount
                                      + "&orderTime=" + orderTime
                                      + "&product=" + product
                                      + "&channel=" + channel
                                      + "&ipnUrl=" + ipnUrl
                                      + "&redirectUrl=" + redirectUrl
                                      + "&partner=" + partner
                                      + "&merchantId=" + merchantId;
            using HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(privateKeyCheckOut));
            var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(planText));
            signature = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }

        if (string.IsNullOrWhiteSpace(signature))
        {
            throw new Exception("Generate signature to send pay request failed.");
        }
        return signature;
    }
    public static string GenerateForCheckTransaction(string key, string orderNo, string transNo,
        string product, string channel, string partner, string merchantId)
    {
        string signature;
        var privateKeyCheckOut = key.Substring(0, 10);
        var planText = "orderNo=" + orderNo
                                  + "&transNo=" + transNo
                                  + "&product=" + product
                                  + "&channel=" + channel
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
}