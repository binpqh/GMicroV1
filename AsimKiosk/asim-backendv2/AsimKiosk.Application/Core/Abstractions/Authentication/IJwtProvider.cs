using AsimKiosk.Contracts.Authentication;

namespace AsimKiosk.Application.Core.Abstractions.Authentication;

public interface IJwtProvider
{
    string Generate(AuthenticateRequest req);
}
