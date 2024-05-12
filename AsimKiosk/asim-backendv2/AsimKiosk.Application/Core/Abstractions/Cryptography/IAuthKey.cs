namespace AsimKiosk.Application.Core.Abstractions.Cryptography;

public interface IAuthKey
{
    string GenBasicKey(string deviceId, string keyTime);
}
