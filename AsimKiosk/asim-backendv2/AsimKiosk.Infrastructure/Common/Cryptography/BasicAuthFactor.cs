using AsimKiosk.Application.Core.Abstractions.Cryptography;
using System.Text;

namespace AsimKiosk.Infrastructure.Common.Cryptography;

internal class BasicAuthFactor : IAuthKey
{
    public string GenBasicKey(string deviceId, string keyTime)
    {
        return Convert.ToBase64String(Encoding.GetEncoding("ISO-8859-1")
            .GetBytes(deviceId + ":" + keyTime));
    }
}